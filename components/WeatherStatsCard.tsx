import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather } from '../services/weather';
import { theme } from '../src/styles/theme';
import SectionHeader from './SectionHeader';
import WeatherIcon from './WeatherIcon';

type Props = {
  weather: CurrentWeather;
};

export default function WeatherStatsCard({ weather }: Props) {
  return (
    <View style={styles.section}>
      <SectionHeader title="현재 날씨" />
      <View style={styles.statsCard}>
        <View style={styles.statsIconRow}>
          <WeatherIcon icon={weather.icon} size={48} />
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>습도</Text>
            <Text style={styles.statValue}>{weather.humidity}%</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>풍속</Text>
            <Text style={styles.statValue}>{weather.windSpeed}m/s</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>체감</Text>
            <Text style={styles.statValue}>{weather.feelsLike}°</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.layout.cardGap,
  },
  statsCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  statsIconRow: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: theme.colors.divider,
    opacity: 0.7,
  },
  statLabel: {
    ...theme.typography.label,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSize.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
