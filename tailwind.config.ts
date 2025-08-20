import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        success: "var(--success)",
        "success-foreground": "var(--success-foreground)",
        warning: "var(--warning)",
        "warning-foreground": "var(--warning-foreground)",
        emergency: "var(--emergency)",
        "emergency-foreground": "var(--emergency-foreground)",
        info: "var(--info)",
        "info-foreground": "var(--info-foreground)",
      },
      fontSize: {
        'xs': ['0.875rem', { lineHeight: '1.25rem' }], // Increased from 0.75rem
        'sm': ['1rem', { lineHeight: '1.5rem' }], // Increased from 0.875rem
        'base': ['1.125rem', { lineHeight: '1.75rem' }], // Increased from 1rem
        'lg': ['1.25rem', { lineHeight: '1.875rem' }], // Enhanced line height
        'xl': ['1.375rem', { lineHeight: '1.875rem' }], // Increased from 1.25rem
        '2xl': ['1.625rem', { lineHeight: '2.25rem' }], // Increased from 1.5rem
        '3xl': ['2rem', { lineHeight: '2.5rem' }], // Increased from 1.875rem
        '4xl': ['2.5rem', { lineHeight: '3rem' }], // Increased from 2.25rem
        '5xl': ['3rem', { lineHeight: '3.5rem' }], // Added for large headings
        '6xl': ['3.75rem', { lineHeight: '4rem' }], // Added for hero text
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    // Removed Preline plugin temporarily to avoid TypeScript issues
    // All styling uses standard Tailwind classes
  ],
} satisfies Config;