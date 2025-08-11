export const typography = {
  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Font weights
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },

  // Line heights
  lineHeight: {
    xs: 16,
    sm: 20,
    base: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 40,
  },

  // Text styles
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },

  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 28,
  },

  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },

  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },

  buttonSmall: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
  },
} as const;

export type TypographyKey = keyof typeof typography;
