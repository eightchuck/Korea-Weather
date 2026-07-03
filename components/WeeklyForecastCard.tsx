import { StyleSheet, Text, View } from 'react-native';
import { WeeklyWeatherItem } from '../services/weather';

type Props = {
  weeklyWeather: WeeklyWeatherItem[];
};

export default function WeeklyForecastCard({ weeklyWeather }: Props) {
  if (weeklyWeather.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>주간 예보</Text>
      {weeklyWeather.map((item, index) => (
        <Text key={index} style={styles.row}>
          {item.day}  {item.maxTemp}° / {item.minTemp}°  {item.condition}
        </Text>
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
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 6,
  },
  row: {
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 8,
  },
});
