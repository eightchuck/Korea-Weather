import { StyleSheet, Text, View } from 'react-native';
import { CityWeatherItem } from '../services/weather';
import WeatherIcon from './WeatherIcon';

type Props = {
  cityWeatherList: CityWeatherItem[];
};

export default function CityWeatherList({ cityWeatherList }: Props) {
  if (cityWeatherList.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>전국 날씨</Text>
      {cityWeatherList.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.city}>{item.city}</Text>
          <View style={styles.weatherInfo}>
            <WeatherIcon icon={item.icon} size={36} />
            <Text style={styles.weatherText}>
              {Math.round(item.temp)}°C · {item.weather}
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
  city: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    width: 48,
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
