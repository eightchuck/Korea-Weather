import { ViewStyle } from 'react-native';

export const colors = {
  primary: '#4A90E2',
  sky: '#6CB4EE',
  background: '#F7F9FC',
  card: '#FFFFFF',
  text: '#1F2937',
  textSecondary: '#6B7280',
  subText: '#6B7280',
  divider: '#E5E7EB',
  border: 'rgba(0, 0, 0, 0.06)',
  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  hero: '#EAF3FC',
  primaryTint: 'rgba(74, 144, 226, 0.07)',
  primaryBorder: 'rgba(74, 144, 226, 0.22)',
  skeleton: '#E5EBF3',
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 18,
  pill: 27,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 32,
  sectionTop: 24,
  sectionBottom: 12,
};

export const fontSize = {
  caption: 12,
  hourlyTime: 14,
  hourlyTemperature: 19,
  searchResultRegion: 14,
  body: 16,
  sectionHeader: 18,
  heroCondition: 24,
  subtitle: 20,
  title: 28,
  temperature: 56,
  heroTemperature: 78,
};

export const layout = {
  screenPadding: 20,
  cardGap: 20,
  cardPadding: 16,
  searchHeight: 54,
  favoriteTouchSize: 44,
  favoriteIconSize: 15,
  heroPaddingTop: 28,
  heroPaddingBottom: 24,
  hourlyCardWidth: 72,
  hourlyCardHeight: 110,
  hourlyCardGap: 11,
  hourlyIconSize: 32,
  hourlyIconAreaHeight: 34,
  weeklyRowHeight: 62,
  weeklyIconSize: 32,
  weeklyIconAreaWidth: 40,
  weeklyDayWidth: 28,
  cityRowHeight: 58,
  cityIconSize: 32,
  cityIconAreaWidth: 40,
  searchResultRowHeight: 64,
  searchResultPaddingHorizontal: 16,
  searchResultPaddingVertical: 14,
  searchResultChevronSize: 19,
  searchResultsMaxHeight: 340,
  rowActionSize: 22,
};

export const typography = {
  inputPlaceholder: {
    fontSize: fontSize.body,
    fontWeight: '400' as const,
    color: colors.subText,
    lineHeight: 22,
  },
  hero: {
    locationType: {
      fontSize: fontSize.caption,
      fontWeight: '500' as const,
      color: colors.textSecondary,
    },
    locationName: {
      fontSize: fontSize.sectionHeader,
      fontWeight: '600' as const,
      color: colors.text,
    },
    temperature: {
      fontSize: fontSize.heroTemperature,
      fontWeight: '700' as const,
      color: colors.text,
    },
    condition: {
      fontSize: fontSize.heroCondition,
      fontWeight: '500' as const,
      color: colors.text,
    },
    summary: {
      fontSize: fontSize.body,
      fontWeight: '400' as const,
      color: colors.textSecondary,
    },
  },
  hourly: {
    time: {
      fontSize: fontSize.hourlyTime,
      fontWeight: '500' as const,
      color: colors.textSecondary,
    },
    temperature: {
      fontSize: fontSize.hourlyTemperature,
      fontWeight: '600' as const,
      color: colors.text,
    },
  },
  weekly: {
    day: {
      fontSize: fontSize.body,
      fontWeight: '500' as const,
      color: colors.text,
    },
    minTemp: {
      fontSize: fontSize.body,
      fontWeight: '400' as const,
      color: colors.textSecondary,
    },
    maxTemp: {
      fontSize: fontSize.body,
      fontWeight: '600' as const,
      color: colors.text,
    },
  },
  city: {
    name: {
      fontSize: fontSize.body,
      fontWeight: '500' as const,
      color: colors.text,
    },
    temperature: {
      fontSize: fontSize.sectionHeader,
      fontWeight: '600' as const,
      color: colors.text,
    },
  },
  searchResult: {
    title: {
      fontSize: fontSize.body,
      fontWeight: '600' as const,
      color: colors.text,
    },
    region: {
      fontSize: fontSize.searchResultRegion,
      fontWeight: '400' as const,
      color: colors.textSecondary,
    },
    emptyTitle: {
      fontSize: fontSize.body,
      fontWeight: '600' as const,
      color: colors.text,
      textAlign: 'center' as const,
    },
    emptyHint: {
      fontSize: fontSize.searchResultRegion,
      fontWeight: '400' as const,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
  },
  loading: {
    appName: {
      fontSize: fontSize.sectionHeader,
      fontWeight: '600' as const,
      color: colors.text,
    },
    main: {
      fontSize: fontSize.body,
      fontWeight: '500' as const,
      color: colors.text,
      textAlign: 'center' as const,
    },
    sub: {
      fontSize: fontSize.caption,
      fontWeight: '400' as const,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
    heroUpdating: {
      fontSize: fontSize.caption,
      fontWeight: '400' as const,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
  },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  } satisfies ViewStyle,
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  } satisfies ViewStyle,
  hourlyCard: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  } satisfies ViewStyle,
};

export const theme = {
  colors,
  radius,
  spacing,
  fontSize,
  layout,
  typography,
  shadow,
};

export type Theme = typeof theme;
