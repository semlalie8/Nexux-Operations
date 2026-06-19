/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--bg-base, #0A0A0F)',
          surface: 'var(--bg-surface, #111118)',
          elevated: 'var(--bg-elevated, #16161F)',
        },
        border: 'var(--border, #1E1E2E)',
        accent: {
          primary: 'var(--accent-primary, #6366F1)',
          success: 'var(--accent-success, #10B981)',
          warning: 'var(--accent-warning, #F59E0B)',
          danger: 'var(--accent-danger, #EF4444)',
        },
        text: {
          primary: 'var(--text-primary, #F8FAFC)',
          secondary: 'var(--text-secondary, #94A3B8)',
          muted: 'var(--text-muted, #475569)',
        }
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      }
    },
  },
  plugins: [],
}
