import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import SectionHeader from '../../components/SectionHeader';
import { theme } from '../styles/theme';

const PULSE_MIN = 0.45;
const PULSE_MAX = 0.9;
const PULSE_HALF_MS = 525;
const HOURLY_ITEM_COUNT = 5;
const WEEKLY_ROW_COUNT = 5;
const CITY_ROW_COUNT = 5;

type SkeletonBlockProps = {
  width: number | `${number}%`;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
  pulse: Animated.Value;
};

function SkeletonBlock({
  width,
  height,
  borderRadius = theme.radius.sm,
  style,
  pulse,
}: SkeletonBlockProps) {
  return (
    <Animated.View
      style={[
        styles.block,
        { width, height, borderRadius, opacity: pulse },
        style,
      ]}
    />
  );
}

type SkeletonSectionProps = {
  pulse: Animated.Value;
};

function HeroSkeleton({ pulse }: SkeletonSectionProps) {
  return (
    <View style={styles.heroCard}>
      <View style={styles.heroContent}>
        <SkeletonBlock width={72} height={12} borderRadius={theme.radius.sm} pulse={pulse} />
        <SkeletonBlock
          width={168}
          height={18}
          borderRadius={theme.radius.sm}
          pulse={pulse}
          style={styles.heroLocationBar}
        />
        <SkeletonBlock
          width={108}
          height={52}
          borderRadius={theme.radius.md}
          pulse={pulse}
          style={styles.heroTempBar}
        />
        <SkeletonBlock
          width={88}
          height={22}
          borderRadius={theme.radius.sm}
          pulse={pulse}
          style={styles.heroConditionBar}
        />
        <SkeletonBlock
          width={196}
          height={14}
          borderRadius={theme.radius.sm}
          pulse={pulse}
        />
      </View>
      <View style={styles.heroButtonRow}>
        <SkeletonBlock
          width={88}
          height={32}
          borderRadius={theme.radius.full}
          pulse={pulse}
        />
        <SkeletonBlock
          width={88}
          height={32}
          borderRadius={theme.radius.full}
          pulse={pulse}
        />
      </View>
      <View style={styles.heroFooterSlot}>
        <SkeletonBlock width={140} height={12} borderRadius={theme.radius.sm} pulse={pulse} />
      </View>
    </View>
  );
}

function HourlyForecastSkeleton({ pulse }: SkeletonSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="시간별 예보" />
      <View style={styles.hourlyRow}>
        {Array.from({ length: HOURLY_ITEM_COUNT }).map((_, index) => (
          <View key={`hourly-skeleton-${index}`} style={styles.hourCard}>
            <SkeletonBlock width={28} height={12} borderRadius={theme.radius.sm} pulse={pulse} />
            <SkeletonBlock
              width={theme.layout.hourlyIconSize}
              height={theme.layout.hourlyIconSize}
              borderRadius={theme.layout.hourlyIconSize / 2}
              pulse={pulse}
            />
            <SkeletonBlock width={32} height={16} borderRadius={theme.radius.sm} pulse={pulse} />
          </View>
        ))}
      </View>
    </View>
  );
}

function WeeklyForecastSkeleton({ pulse }: SkeletonSectionProps) {
  const dayWidths = [20, 24, 20, 22, 20];

  return (
    <View style={styles.section}>
      <SectionHeader title="7일 예보" />
      <View style={styles.listCard}>
        {Array.from({ length: WEEKLY_ROW_COUNT }).map((_, index) => (
          <View key={`weekly-skeleton-${index}`}>
            <View style={styles.weeklyRow}>
              <View style={styles.weeklyDaySlot}>
                <SkeletonBlock
                  width={dayWidths[index]}
                  height={14}
                  borderRadius={theme.radius.sm}
                  pulse={pulse}
                />
              </View>
              <View style={styles.weeklyIconArea}>
                <SkeletonBlock
                  width={theme.layout.weeklyIconSize}
                  height={theme.layout.weeklyIconSize}
                  borderRadius={theme.layout.weeklyIconSize / 2}
                  pulse={pulse}
                />
              </View>
              <View style={styles.weeklyTempGroup}>
                <SkeletonBlock width={28} height={14} borderRadius={theme.radius.sm} pulse={pulse} />
                <SkeletonBlock width={32} height={14} borderRadius={theme.radius.sm} pulse={pulse} />
              </View>
            </View>
            {index < WEEKLY_ROW_COUNT - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

function CityWeatherSkeleton({ pulse }: SkeletonSectionProps) {
  const cityWidths = [36, 32, 28, 36, 32];

  return (
    <View style={styles.section}>
      <SectionHeader title="전국 날씨" />
      <View style={styles.listCard}>
        {Array.from({ length: CITY_ROW_COUNT }).map((_, index) => (
          <View key={`city-skeleton-${index}`}>
            <View style={styles.cityRow}>
              <SkeletonBlock
                width={cityWidths[index]}
                height={14}
                borderRadius={theme.radius.sm}
                pulse={pulse}
              />
              <View style={styles.cityIconArea}>
                <SkeletonBlock
                  width={theme.layout.cityIconSize}
                  height={theme.layout.cityIconSize}
                  borderRadius={theme.layout.cityIconSize / 2}
                  pulse={pulse}
                />
              </View>
              <View style={styles.citySpacer} />
              <SkeletonBlock width={36} height={16} borderRadius={theme.radius.sm} pulse={pulse} />
            </View>
            {index < CITY_ROW_COUNT - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

export default function WeatherSkeleton() {
  const pulse = useRef(new Animated.Value(PULSE_MIN)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: PULSE_MAX,
          duration: PULSE_HALF_MS,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: PULSE_MIN,
          duration: PULSE_HALF_MS,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <HeroSkeleton pulse={pulse} />
      <HourlyForecastSkeleton pulse={pulse} />
      <WeeklyForecastSkeleton pulse={pulse} />
      <CityWeatherSkeleton pulse={pulse} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  block: {
    backgroundColor: theme.colors.skeleton,
  },
  section: {
    marginBottom: theme.layout.cardGap,
  },
  heroCard: {
    backgroundColor: theme.colors.hero,
    borderRadius: theme.radius.xl,
    paddingTop: theme.layout.heroPaddingTop,
    paddingBottom: theme.layout.heroPaddingBottom,
    paddingHorizontal: theme.layout.cardPadding,
    marginBottom: theme.layout.cardGap,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
  },
  heroLocationBar: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  heroTempBar: {
    marginBottom: theme.spacing.sm,
  },
  heroConditionBar: {
    marginBottom: theme.spacing.md,
  },
  heroButtonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  heroFooterSlot: {
    minHeight: 18,
    marginTop: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourlyRow: {
    flexDirection: 'row',
    gap: theme.layout.hourlyCardGap,
  },
  hourCard: {
    width: theme.layout.hourlyCardWidth,
    height: theme.layout.hourlyCardHeight,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.hourlyCard,
  },
  listCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.weeklyRowHeight,
  },
  weeklyDaySlot: {
    width: theme.layout.weeklyDayWidth,
  },
  weeklyIconArea: {
    width: theme.layout.weeklyIconAreaWidth,
    height: theme.layout.weeklyRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weeklyTempGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.cityRowHeight,
  },
  cityIconArea: {
    width: theme.layout.cityIconAreaWidth,
    height: theme.layout.cityRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  citySpacer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    opacity: 0.7,
  },
});
