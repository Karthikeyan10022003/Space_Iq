/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        base:    '#0B0F14',
        card:    '#111827',
        sidebar: '#0B0F14',
        border:  'rgba(255,255,255,0.08)',
        accent: {
          red:    '#E11D48',
          light:  '#F43F5E',
          muted:  'rgba(225,29,72,0.15)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '8px',
        xl2: '12px',
      },
      boxShadow: {
        card:   '0 2px 8px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.45s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in':    'fadeIn 0.3s ease both',
        'shimmer':    'shimmer 1.6s infinite linear',
      },
    },
  },
  plugins: [],
}
