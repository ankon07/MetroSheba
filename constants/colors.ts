// Modern green color palette for Dhaka Metro Rail
const primaryColor = "#80c799"; // Primary green
const secondaryColor = "#4da284"; // Secondary green
const accentColor = "#2d7974"; // Accent teal
const darkColor = "#1d4f60"; // Dark teal
const errorColor = "#F44336"; // Red
const warningColor = "#FF9800"; // Orange
const infoColor = "#2196F3"; // Blue
const textPrimary = "#1d4f60"; // Dark text
const textSecondary = "#2d7974"; // Medium text
const borderColor = "#E0E0E0"; // Light gray border
const backgroundColor = "#FFFFFF"; // White background
const cardBackground = "#FFFFFF"; // White cards
const surfaceColor = "#F8F9FA"; // Light surface

export default {
  primary: primaryColor,
  secondary: secondaryColor,
  accent: accentColor,
  dark: darkColor,
  success: primaryColor,
  error: errorColor,
  warning: warningColor,
  info: infoColor,
  text: {
    primary: textPrimary,
    secondary: textSecondary,
    light: "#FFFFFF",
    muted: "#757575",
  },
  border: borderColor,
  background: backgroundColor,
  card: cardBackground,
  surface: surfaceColor,
  statusBar: "dark",
  tabBar: {
    active: primaryColor,
    inactive: "#9E9E9E",
    background: backgroundColor,
  },
  transportationIcons: {
    plane: "#2196F3",
    train: primaryColor,
    bus: warningColor,
    car: errorColor,
    ferry: "#9C27B0",
  },
  gradients: {
    primary: [primaryColor, secondaryColor],
    success: [primaryColor, secondaryColor],
    card: [cardBackground, surfaceColor],
    metro: [darkColor, accentColor, secondaryColor, primaryColor],
  },
  metro: {
    line6: primaryColor,
    upcoming: secondaryColor,
    station: accentColor,
    platform: "#757575",
    intermediate: primaryColor,
    current: secondaryColor,
  },
};