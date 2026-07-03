import { StyleSheet, Text, View } from 'react-native';
import { HourlyWeatherItem } from '../services/weather';

type Props = {
  hourlyWeather: HourlyWeatherItem[];
};

export default function ForecastCard({ hourlyWeather }: Props) {
  if (hourlyWeather.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>3시간 예보</Text>
      {hourlyWeather.map((item, index) => (
        <Text key={index} style={styles.row}>
          {item.hour}  {item.temperature}°  {item.condition}
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
