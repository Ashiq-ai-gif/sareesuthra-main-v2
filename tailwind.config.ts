import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['"Lato"', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Theme Colors - Saree Sutra
        // Custom Theme Colors - Saree Sutra (Light Theme)
        puniora: {
          black: "#1A1A1A",   // Soft Black for text
          void: "#FEFBF7",    // Soft Cream Background (Main)
          glass: "#FFFFFF",   // Card background base (White)
          orange: {
            DEFAULT: "#800020", // Maroon (Primary Brand Color)
            50: "#FCF5F5",
            100: "#F9E6E6",
            200: "#F0C2C2",
            300: "#E69999",
            400: "#DB6666",
            500: "#800020",     // Main Maroon
            600: "#6B001B",
            700: "#550015",
            800: "#400010",
            900: "#2B000B",
            glow: "#D4AF37",    // Gold for glows
          }
        },
        gold: { 
          DEFAULT: "#D4AF37", // Metallic Gold
          light: "#EUC96B",   
          dark: "#B08D26",    
        },
      },
      borderRadius: {
        lg: "1.5rem",         // Rounder corners as per reference
        md: "1rem",
        sm: "0.5rem",
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #E6C96B 0%, #D4AF37 100%)',
        'gradient-dark': 'linear-gradient(to bottom, #FEFBF7 0%, #F5EBE0 100%)', // Cream gradient
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)', // White card gradient
        'shimmer-overlay': 'linear-gradient(to right, transparent 0%, rgba(212,175,55,0.1) 50%, transparent 100%)',
        'gradient-ember': 'radial-gradient(circle at center, rgba(128, 0, 32, 0.05) 0%, rgba(255, 255, 255, 0) 70%)',
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        "fade-in-up": "fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fade-in 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "zoom-in": "zoom-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-in-right": "slide-in-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-glow": "pulse-glow 5s infinite",
        "reveal": "reveal 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        "spin-slow": "spin 12s linear infinite",
        "liquid": "liquid 15s ease infinite",
        "mesh": "mesh 20s ease-in-out infinite",
        "float-slow": "float 8s ease-in-out infinite",
      },
      keyframes: {
        mesh: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        liquid: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "zoom-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0px rgba(212, 175, 55, 0)" },
          "50%": { boxShadow: "0 0 25px 5px rgba(212, 175, 55, 0.15)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(40px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
