import { StyleSheet, Text, View } from 'react-native';
import { WeeklyWeatherItem } from '../services/weather';
import { theme } from '../src/styles/theme';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import WeatherIcon from './WeatherIcon';

type Props = {
  weeklyWeather: WeeklyWeatherItem[];
  showEmpty?: boolean;
};

export default function WeeklyForecastCard({ weeklyWeather, showEmpty = false }: Props) {
  if (weeklyWeather.length === 0 && !showEmpty) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="7일 예보" />
      {weeklyWeather.length > 0 ? (
        <View style={styles.card}>
          {weeklyWeather.map((item, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.day}>{item.day}</Text>
                <View style={styles.iconArea}>
                  <WeatherIcon icon={item.icon} size={theme.layout.weeklyIconSize} />
                </View>
                <View style={styles.tempGroup}>
                  <Text style={styles.minTemp}>{item.minTemp}°</Text>
                  <Text style={styles.maxTemp}>{item.maxTemp}°</Text>
                </View>
              </View>
              {index < weeklyWeather.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <EmptyState
            title="표시할 주간 예보가 없습니다"
            description="잠시 후 다시 확인해 주세요"
            compact
            surface
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.layout.cardGap,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.listRowHeight,
  },
  day: {
    ...theme.typography.weekly.day,
    width: theme.layout.weeklyDayWidth,
  },
  iconArea: {
    width: theme.layout.weeklyIconAreaWidth,
    height: theme.layout.listRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tempGroup: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  minTemp: {
    ...theme.typography.weekly.minTemp,
  },
  maxTemp: {
    ...theme.typography.weekly.maxTemp,
  },
  divider: {
    ...theme.divider.line,
  },
});
