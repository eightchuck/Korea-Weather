import { ViewStyle } from 'react-native';

export const colors = {
  primary: '#4A90E2',
  sky: '#6CB4EE',
  background: '#F5F7FA',
  card: '#FFFFFF',
  text: '#1F2937',
  subText: '#6B7280',
  divider: '#E5E7EB',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const fontSize = {
  caption: 12,
  body: 16,
  subtitle: 20,
  title: 28,
  temperature: 56,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  } satisfies ViewStyle,
};

export const theme = {
  colors,
  radius,
  spacing,
  fontSize,
  shadow,
};

export type Theme = typeof theme;
