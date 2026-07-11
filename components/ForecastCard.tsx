import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HourlyWeatherItem } from '../services/weather';
import { theme } from '../src/styles/theme';
import SectionHeader from './SectionHeader';
import WeatherIcon from './WeatherIcon';

type Props = {
  hourlyWeather: HourlyWeatherItem[];
};

export default function ForecastCard({ hourlyWeather }: Props) {
  if (hourlyWeather.length === 0) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="시간별 예보" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {hourlyWeather.map((item, index) => (
          <View
            key={index}
            style={[styles.hourCard, index === 0 && styles.hourCardCurrent]}
          >
            <Text style={styles.hour}>{index === 0 ? '지금' : item.hour}</Text>
            <View style={styles.iconArea}>
              <WeatherIcon icon={item.icon} size={theme.layout.hourlyIconSize} />
            </View>
            <Text style={styles.temperature}>{item.temperature}°</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.layout.cardGap,
  },
  scrollContent: {
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
  hourCardCurrent: {
    backgroundColor: theme.colors.primaryTint,
    borderColor: theme.colors.primaryBorder,
  },
  hour: {
    ...theme.typography.hourly.time,
    textAlign: 'center',
  },
  iconArea: {
    width: '100%',
    height: theme.layout.hourlyIconAreaHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperature: {
    ...theme.typography.hourly.temperature,
    textAlign: 'center',
  },
});
