/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Professional Theme Colors
        dark: '#0b0f13',
        panel: '#11151b',
        card: '#14181f',
        accent: {
          teal: '#00f5d4',
          purple: '#9d4edd',
          gold: '#ffb703',
          blue: '#00b3ff',
        },
        text: {
          main: '#e5e7eb',
          secondary: '#9ca3af',
          muted: '#6b7280',
        },
        // Legacy colors (for backward compatibility)
        background: "#0b0f13",
        neonCyan: "#00f5d4",
        purple: "#9d4edd",
        orange: "#ff6b00",
        emeraldGreen: "#00ff8f",
      },
      fontFamily: {
        inter: ["Inter", "Segoe UI", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      borderRadius: {
        'pro': '18px',
        'pro-sm': '14px',
        'pro-lg': '24px',
      },
      boxShadow: {
        'pro': '0 0 18px rgba(0, 0, 0, 0.4)',
        'pro-hover': '0 0 24px rgba(0, 0, 0, 0.5)',
        'glow': '0 0 10px rgba(0, 180, 255, 0.5)',
        'glow-strong': '0 0 20px rgba(0, 180, 255, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'gradient-move': 'gradientMove 30s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 180, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 180, 255, 0.6)' },
        },
        gradientMove: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backdropBlur: {
        'pro': '12px',
        'pro-strong': '16px',
      },
    },
  },
  plugins: [],
}
