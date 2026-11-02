/**
 * DVC design tokens — deep navy / teal construction palette (PRD §5).
 * Mockups are a visual guide; tokens keep the product cohesive.
 */
export const colors = {
  navy: "#0B1F3A",
  navyDeep: "#071528",
  navyMuted: "#1A3358",
  teal: "#0D9488",
  tealDark: "#0F766E",
  tealLight: "#CCFBF1",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  orange: "#EA580C",
  red: "#DC2626",
  redSoft: "#FEE2E2",
  white: "#FFFFFF",
  offWhite: "#F7F5F2",
  surface: "#F0EEEA",
  grey100: "#F3F4F6",
  grey200: "#E5E7EB",
  grey400: "#9CA3AF",
  grey500: "#6B7280",
  grey700: "#374151",
  textPrimary: "#0B1F3A",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const typography = {
  brand: {
    fontFamily: "System",
    fontSize: 22,
    fontWeight: "700" as const,
  },
  title: {
    fontFamily: "System",
    fontSize: 20,
    fontWeight: "700" as const,
  },
  subtitle: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  body: {
    fontFamily: "System",
    fontSize: 15,
    fontWeight: "400" as const,
  },
  caption: {
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "400" as const,
  },
  amount: {
    fontFamily: "System",
    fontSize: 18,
    fontWeight: "700" as const,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: "#0B1F3A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
} as const;

export type ColorToken = keyof typeof colors;
