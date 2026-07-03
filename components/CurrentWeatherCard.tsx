import { StyleSheet, Text, View } from 'react-native';
import { CurrentWeather } from '../services/weather';

type Props = {
  locationText: string;
  weather: CurrentWeather | null;
  weatherMessage: string;
};

export default function CurrentWeatherCard({ locationText, weather, weatherMessage }: Props) {
  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>📍 현재 위치</Text>
        <Text style={styles.location}>{locationText}</Text>
      </View>

      <View style={styles.card}>
        {weather ? (
          <>
            <Text style={styles.temperature}>☀️ {weather.temperature}°C</Text>
            <Text style={styles.condition}>{weather.condition}</Text>
            <Text style={styles.detail}>체감온도 {weather.feelsLike}°C</Text>
            <Text style={styles.detail}>습도 {weather.humidity}%</Text>
            <Text style={styles.detail}>풍속 {weather.windSpeed}m/s</Text>
          </>
        ) : (
          <Text style={styles.condition}>{weatherMessage}</Text>
        )}
      </View>
    </>
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
  location: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1c1c1e',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  condition: {
    fontSize: 20,
    color: '#3a3a3c',
    marginBottom: 12,
  },
  detail: {
    fontSize: 15,
    color: '#8e8e93',
    marginBottom: 4,
  },
});
