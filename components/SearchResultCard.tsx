import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FavoriteLocation } from '../services/favoriteLocations';
import { CurrentWeather } from '../services/weather';
import WeatherIcon from './WeatherIcon';

type Props = {
  location: FavoriteLocation;
  weather: CurrentWeather;
  isFavorite: boolean;
  onToggleFavorite: (location: FavoriteLocation) => void;
};

export default function SearchResultCard({
  location,
  weather,
  isFavorite,
  onToggleFavorite,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>검색 결과</Text>
        <Pressable onPress={() => onToggleFavorite(location)}>
          <Text style={styles.starButton}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Text style={styles.location}>{location.name}</Text>
      <View style={styles.weatherRow}>
        <WeatherIcon icon={weather.icon} size={48} />
        <Text style={styles.weather}>
          {weather.temperature}°C · {weather.condition}
        </Text>
      </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#8e8e93',
  },
  starButton: {
    fontSize: 24,
    color: '#ff9500',
  },
  location: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 6,
  },
  weather: {
    fontSize: 16,
    color: '#3a3a3c',
    flex: 1,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
