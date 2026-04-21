require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "527258730";

const IS_PROD = process.env.NODE_ENV === "production" || process.env.VERCEL;

const REDIRECT_URI = IS_PROD 
    ? "https://space-iq-iota.vercel.app/auth/callback" 
    : "http://localhost:3001/auth/callback";

const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

const SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly"
];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.get("/auth/login", (req, res) => {
    const authUrl = OAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
    });
    res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    try {
        const { tokens } = await OAuth2Client.getToken(code);
        OAuth2Client.setCredentials(tokens);
        global.savedTokens = tokens;
        res.redirect(IS_PROD ? "https://space-iq-iota.vercel.app" : "http://localhost:5173");
    } catch (err) {
        res.status(500).send(`Auth failed: ${err.message}`);
    }
});

const requireAuth = (req, res, next) => {
    if (!global.savedTokens) {
        return res.status(401).json({
            error: "Not authenticated. Visit http://localhost:3001/auth/login",
        });
    }
    OAuth2Client.setCredentials(global.savedTokens);
    next();
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const runRealtimeReport = async (body) => {
    const { token } = await OAuth2Client.getAccessToken();
    const res = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runRealtimeReport`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    if (!res.ok) throw new Error((await res.json()).error?.message);
    return res.json();
};

const runReport = async (body) => {
    const { token } = await OAuth2Client.getAccessToken();
    const res = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
        {
            method: "POST",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );
    if (!res.ok) throw new Error((await res.json()).error?.message);
    return res.json();
};

// ─── ROUTE: Realtime All ──────────────────────────────────────────────────────
app.get("/api/realtime/all", requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        const [overviewData, perMinuteData, pagesData] = await Promise.all([
            runRealtimeReport({
                metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
            }),
            runRealtimeReport({
                dimensions: [{ name: "minutesAgo" }],
                metrics: [{ name: "activeUsers" }],
                minuteRanges: [{ name: "last30min", startMinutesAgo: 29, endMinutesAgo: 0 }],
            }),
            runRealtimeReport({
                dimensions: [{ name: "unifiedScreenName" }],
                metrics: [{ name: "activeUsers" }, { name: "screenPageViews" }],
                limit,
                orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            }),
        ]);

        const usersPerMinute = [];
        for (let i = 29; i >= 0; i--) {
            const row = perMinuteData.rows?.find((r) => r.dimensionValues[0].value === String(i));
            usersPerMinute.push({
                label: `-${i}m`,
                activeUsers: row ? parseInt(row.metricValues[0].value) : 0,
            });
        }

        res.json({
            activeUsersLast30Min: parseInt(overviewData.rows?.[0]?.metricValues?.[0]?.value ?? "0"),
            viewsLast30Min: parseInt(overviewData.rows?.[0]?.metricValues?.[1]?.value ?? "0"),
            usersPerMinute,
            pages: {
                total: pagesData.rowCount ?? 0,
                data: pagesData.rows?.map((row, i) => ({
                    rank: i + 1,
                    pagePath: row.dimensionValues[0].value,
                    activeUsers: parseInt(row.metricValues[0].value),
                    views: parseInt(row.metricValues[1].value),
                })) ?? [],
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: Realtime Countries ────────────────────────────────────────────────
// Matches the "Country → Active Users" table in your GA4 screenshot
app.get("/api/realtime/countries", requireAuth, async (req, res) => {
    try {
        const data = await runRealtimeReport({
            dimensions: [{ name: "countryId" }, { name: "country" }],
            metrics: [{ name: "activeUsers" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
            limit: 10,
        });

        const countries = data.rows?.map((row, i) => ({
            rank: i + 1,
            countryCode: row.dimensionValues[0].value,
            country: row.dimensionValues[1].value,
            activeUsers: parseInt(row.metricValues[0].value),
        })) ?? [];

        res.json({ countries });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: 7-Day Overview ────────────────────────────────────────────────────
// Matches the left panel: Active users 765, Events 4.4k, New users 729
app.get("/api/overview", requireAuth, async (req, res) => {
    try {
        const [summaryData, trendData] = await Promise.all([
            // Summary totals for last 7 days
            runReport({
                dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "eventCount" },
                    { name: "newUsers" },
                    { name: "sessions" },
                    { name: "bounceRate" },
                    { name: "averageSessionDuration" },
                ],
            }),
            // Daily trend for chart (last 7 days)
            runReport({
                dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
                dimensions: [{ name: "date" }],
                metrics: [
                    { name: "activeUsers" },
                    { name: "newUsers" },
                    { name: "eventCount" },
                ],
                orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
            }),
        ]);

        const s = summaryData.rows?.[0]?.metricValues ?? [];

        // Format daily trend
        const trend = trendData.rows?.map((row) => {
            const d = row.dimensionValues[0].value; // e.g. "20260414"
            return {
                date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
                activeUsers: parseInt(row.metricValues[0].value),
                newUsers: parseInt(row.metricValues[1].value),
                events: parseInt(row.metricValues[2].value),
            };
        }) ?? [];

        res.json({
            summary: {
                activeUsers: parseInt(s[0]?.value ?? "0"),
                eventCount: parseInt(s[1]?.value ?? "0"),
                newUsers: parseInt(s[2]?.value ?? "0"),
                sessions: parseInt(s[3]?.value ?? "0"),
                bounceRate: parseFloat(s[4]?.value ?? "0").toFixed(2),
                avgSessionDuration: parseFloat(s[5]?.value ?? "0").toFixed(0),
            },
            trend,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: Top Pages (7 days) ────────────────────────────────────────────────
app.get("/api/pages", requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const data = await runReport({
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "pagePath" }, { name: "pageTitle" }],
            metrics: [
                { name: "screenPageViews" },
                { name: "activeUsers" },
                { name: "averageSessionDuration" },
                { name: "bounceRate" },
            ],
            orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
            limit,
        });

        const pages = data.rows?.map((row, i) => ({
            rank: i + 1,
            path: row.dimensionValues[0].value,
            title: row.dimensionValues[1].value,
            views: parseInt(row.metricValues[0].value),
            activeUsers: parseInt(row.metricValues[1].value),
            avgDuration: parseFloat(row.metricValues[2].value).toFixed(0),
            bounceRate: parseFloat(row.metricValues[3].value).toFixed(2),
        })) ?? [];

        res.json({ total: data.rowCount ?? 0, pages });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: Traffic Sources ───────────────────────────────────────────────────
app.get("/api/sources", requireAuth, async (req, res) => {
    try {
        const data = await runReport({
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "sessionDefaultChannelGroup" }],
            metrics: [
                { name: "sessions" },
                { name: "activeUsers" },
                { name: "newUsers" },
            ],
            orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
        });

        const sources = data.rows?.map((row) => ({
            channel: row.dimensionValues[0].value,
            sessions: parseInt(row.metricValues[0].value),
            activeUsers: parseInt(row.metricValues[1].value),
            newUsers: parseInt(row.metricValues[2].value),
        })) ?? [];

        res.json({ sources });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: Device Breakdown ──────────────────────────────────────────────────
app.get("/api/devices", requireAuth, async (req, res) => {
    try {
        const data = await runReport({
            dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
            dimensions: [{ name: "deviceCategory" }],
            metrics: [{ name: "activeUsers" }, { name: "sessions" }],
            orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        });

        const devices = data.rows?.map((row) => ({
            device: row.dimensionValues[0].value,
            activeUsers: parseInt(row.metricValues[0].value),
            sessions: parseInt(row.metricValues[1].value),
        })) ?? [];

        res.json({ devices });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── ROUTE: FULL DASHBOARD — Everything in one call ───────────────────────────
app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
        const [realtime, realtimeCountries, overview, pages, sources, devices] =
            await Promise.allSettled([
                fetch(`http://localhost:3001/api/realtime/all`).then((r) => r.json()),
                fetch(`http://localhost:3001/api/realtime/countries`).then((r) => r.json()),
                fetch(`http://localhost:3001/api/overview`).then((r) => r.json()),
                fetch(`http://localhost:3001/api/pages`).then((r) => r.json()),
                fetch(`http://localhost:3001/api/sources`).then((r) => r.json()),
                fetch(`http://localhost:3001/api/devices`).then((r) => r.json()),
            ]);

        res.json({
            realtime: realtime.status === "fulfilled" ? realtime.value : null,
            realtimeCountries: realtimeCountries.status === "fulfilled" ? realtimeCountries.value : null,
            overview: overview.status === "fulfilled" ? overview.value : null,
            pages: pages.status === "fulfilled" ? pages.value : null,
            sources: sources.status === "fulfilled" ? sources.value : null,
            devices: devices.status === "fulfilled" ? devices.value : null,
            lastUpdated: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ─── START ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\n✅ Server running at http://localhost:${PORT}`);
    console.log(`👉 Login: http://localhost:${PORT}/auth/login\n`);
    console.log(`📊 Full dashboard: http://localhost:${PORT}/api/dashboard\n`);
});