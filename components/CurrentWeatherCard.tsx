import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FavoriteLocation } from '../services/favoriteLocations';
import { CurrentWeather } from '../services/weather';
import WeatherIcon from './WeatherIcon';

type Props = {
  locationText: string;
  weather: CurrentWeather | null;
  weatherMessage: string;
  onReturnToCurrentLocation: () => void;
  onRefresh: () => void;
  isLocationLoading?: boolean;
  canRefresh?: boolean;
  isManualLocation?: boolean;
  selectedLocation?: FavoriteLocation | null;
  isFavorite?: boolean;
  onToggleFavorite?: (location: FavoriteLocation) => void;
};

export default function CurrentWeatherCard({
  locationText,
  weather,
  weatherMessage,
  onReturnToCurrentLocation,
  onRefresh,
  isLocationLoading = false,
  canRefresh = false,
  isManualLocation = false,
  selectedLocation = null,
  isFavorite = false,
  onToggleFavorite,
}: Props) {
  const canFavorite =
    selectedLocation != null &&
    selectedLocation.name.length > 0 &&
    selectedLocation.lat != null &&
    selectedLocation.lon != null;

  return (
    <>
      <View style={styles.card}>
        <View style={styles.locationHeader}>
          <Text style={styles.label}>
            {isManualLocation ? '📍 선택한 위치' : '📍 현재 위치'}
          </Text>
          {canFavorite && onToggleFavorite && (
            <Pressable onPress={() => onToggleFavorite(selectedLocation)}>
              <Text style={styles.starButton}>{isFavorite ? '★' : '☆'}</Text>
            </Pressable>
          )}
        </View>
        <Text style={styles.location}>{locationText}</Text>
        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.actionButton, isLocationLoading && styles.actionButtonDisabled]}
            onPress={onReturnToCurrentLocation}
            disabled={isLocationLoading}
          >
            <Text style={styles.actionButtonText}>현재 위치</Text>
          </Pressable>
          <Pressable
            style={[
              styles.actionButton,
              styles.refreshButton,
              (isLocationLoading || !canRefresh) && styles.actionButtonDisabled,
            ]}
            onPress={onRefresh}
            disabled={isLocationLoading || !canRefresh}
          >
            <Text style={styles.actionButtonText}>새로고침</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        {weather ? (
          <>
            <View style={styles.weatherRow}>
              <WeatherIcon icon={weather.icon} size={80} />
              <Text style={styles.temperature}>{weather.temperature}°C</Text>
            </View>
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
  },
  starButton: {
    fontSize: 24,
    color: '#ff9500',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  location: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    backgroundColor: '#007aff',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  refreshButton: {
    backgroundColor: '#34c759',
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  temperature: {
    fontSize: 48,
    fontWeight: '300',
    color: '#1c1c1e',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
