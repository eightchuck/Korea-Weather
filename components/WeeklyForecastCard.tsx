import { StyleSheet, Text, View } from 'react-native';
import { WeeklyWeatherItem } from '../services/weather';
import WeatherIcon from './WeatherIcon';

type Props = {
  weeklyWeather: WeeklyWeatherItem[];
};

export default function WeeklyForecastCard({ weeklyWeather }: Props) {
  if (weeklyWeather.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>주간 예보</Text>
      {weeklyWeather.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.day}>{item.day}</Text>
          <View style={styles.weatherInfo}>
            <WeatherIcon icon={item.icon} size={40} />
            <Text style={styles.weatherText}>
              {item.maxTemp}° / {item.minTemp}° · {item.condition}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 8,
    paddingVertical: 4,
  },
  day: {
    fontSize: 16,
    color: '#1c1c1e',
    width: 24,
  },
  weatherInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  weatherText: {
    fontSize: 15,
    color: '#1c1c1e',
  },
});
