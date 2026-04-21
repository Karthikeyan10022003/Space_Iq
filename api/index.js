import "dotenv/config";
import express from "express";
import { google } from "googleapis";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || "527258730";

const IS_PROD = process.env.NODE_ENV === "production" || process.env.VERCEL;

// Dynamic Redirect URI: Prioritize env var, fallback to current or localhost
const getRedirectUri = (req) => {
    if (process.env.REDIRECT_URI) return process.env.REDIRECT_URI;
    
    // If we're in dev, default to localhost
    if (!IS_PROD) return "http://localhost:3001/auth/callback";
    
    // Fallback for production if not set in env (not ideal for OAuth but better than nothing)
    const host = req ? req.headers.host : "space-iq-iota.vercel.app";
    const protocol = req && req.headers['x-forwarded-proto'] ? 'https' : 'https';
    return `${protocol}://${host}/auth/callback`;
};

const getOAuth2Client = (req) => {
    return new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        getRedirectUri(req)
    );
};

const SCOPES = [
    "https://www.googleapis.com/auth/analytics.readonly"
];

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.get("/auth/login", (req, res) => {
    const oauth2Client = getOAuth2Client(req);
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        prompt: "consent",
    });
    res.redirect(authUrl);
});

app.get("/auth/callback", async (req, res) => {
    const { code } = req.query;
    const oauth2Client = getOAuth2Client(req);
    try {
        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        global.savedTokens = tokens;
        res.redirect(IS_PROD ? "/" : "http://localhost:5173");
    } catch (err) {
        res.status(500).send(`Auth failed: ${err.message}`);
    }
});

const requireAuth = (req, res, next) => {
    if (!global.savedTokens) {
        const protocol = req.headers['x-forwarded-proto'] || (IS_PROD ? 'https' : 'http');
        const host = req.headers.host;
        const loginUrl = `${protocol}://${host}/auth/login`;
        return res.status(401).json({
            error: "Not authenticated",
            loginUrl: loginUrl
        });
    }
    // We'll set credentials on the client in the actual handlers
    next();
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const getClientWithAuth = () => {
    const client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );
    client.setCredentials(global.savedTokens);
    return client;
};

const runRealtimeReport = async (body) => {
    const client = getClientWithAuth();
    const { token } = await client.getAccessToken();
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
    const client = getClientWithAuth();
    const { token } = await client.getAccessToken();
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

// ─── LOGIC HANDLERS ───────────────────────────────────────────────────────────

const getRealtimeAll = async (limit = 10) => {
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

    return {
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
    };
};

const getRealtimeCountries = async () => {
    const data = await runRealtimeReport({
        dimensions: [{ name: "countryId" }, { name: "country" }],
        metrics: [{ name: "activeUsers" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
        limit: 10,
    });

    return {
        countries: data.rows?.map((row, i) => ({
            rank: i + 1,
            countryCode: row.dimensionValues[0].value,
            country: row.dimensionValues[1].value,
            activeUsers: parseInt(row.metricValues[0].value),
        })) ?? [],
    };
};

const getOverview = async () => {
    const [summaryData, trendData] = await Promise.all([
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
    const trend = trendData.rows?.map((row) => {
        const d = row.dimensionValues[0].value;
        return {
            date: `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`,
            activeUsers: parseInt(row.metricValues[0].value),
            newUsers: parseInt(row.metricValues[1].value),
            events: parseInt(row.metricValues[2].value),
        };
    }) ?? [];

    return {
        summary: {
            activeUsers: parseInt(s[0]?.value ?? "0"),
            eventCount: parseInt(s[1]?.value ?? "0"),
            newUsers: parseInt(s[2]?.value ?? "0"),
            sessions: parseInt(s[3]?.value ?? "0"),
            bounceRate: parseFloat(s[4]?.value ?? "0").toFixed(2),
            avgSessionDuration: parseFloat(s[5]?.value ?? "0").toFixed(0),
        },
        trend,
    };
};

const getPages = async (limit = 10) => {
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

    return {
        total: data.rowCount ?? 0,
        pages: data.rows?.map((row, i) => ({
            rank: i + 1,
            path: row.dimensionValues[0].value,
            title: row.dimensionValues[1].value,
            views: parseInt(row.metricValues[0].value),
            activeUsers: parseInt(row.metricValues[1].value),
            avgDuration: parseFloat(row.metricValues[2].value).toFixed(0),
            bounceRate: parseFloat(row.metricValues[3].value).toFixed(2),
        })) ?? [],
    };
};

const getSources = async () => {
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

    return {
        sources: data.rows?.map((row) => ({
            channel: row.dimensionValues[0].value,
            sessions: parseInt(row.metricValues[0].value),
            activeUsers: parseInt(row.metricValues[1].value),
            newUsers: parseInt(row.metricValues[2].value),
        })) ?? [],
    };
};

const getDevices = async () => {
    const data = await runReport({
        dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
        dimensions: [{ name: "deviceCategory" }],
        metrics: [{ name: "activeUsers" }, { name: "sessions" }],
        orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    });

    return {
        devices: data.rows?.map((row) => ({
            device: row.dimensionValues[0].value,
            activeUsers: parseInt(row.metricValues[0].value),
            sessions: parseInt(row.metricValues[1].value),
        })) ?? [],
    };
};

// ─── ROUTES ───────────────────────────────────────────────────────────────────

app.get("/api/realtime/all", requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const result = await getRealtimeAll(limit);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/realtime/countries", requireAuth, async (req, res) => {
    try {
        const result = await getRealtimeCountries();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/overview", requireAuth, async (req, res) => {
    try {
        const result = await getOverview();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/pages", requireAuth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const result = await getPages(limit);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/sources", requireAuth, async (req, res) => {
    try {
        const result = await getSources();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/devices", requireAuth, async (req, res) => {
    try {
        const result = await getDevices();
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get("/api/dashboard", requireAuth, async (req, res) => {
    try {
        const [realtime, realtimeCountries, overview, pages, sources, devices] =
            await Promise.allSettled([
                getRealtimeAll(),
                getRealtimeCountries(),
                getOverview(),
                getPages(),
                getSources(),
                getDevices(),
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
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
        console.log(`\n✅ Server running at http://localhost:${PORT}`);
        console.log(`👉 Login: http://localhost:${PORT}/auth/login\n`);
    });
}

export default app;