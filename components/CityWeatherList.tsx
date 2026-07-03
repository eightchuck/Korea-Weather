import { StyleSheet, Text, View } from 'react-native';
import { CityWeatherItem } from '../services/weather';

type Props = {
  cityWeatherList: CityWeatherItem[];
};

export default function CityWeatherList({ cityWeatherList }: Props) {
  if (cityWeatherList.length === 0) return null;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>전국 날씨</Text>
      {cityWeatherList.map((item, index) => (
        <Text key={index} style={styles.row}>
          {item.city}  {Math.round(item.temp)}°C  {item.weather}
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
