import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FavoriteLocation } from '../services/favoriteLocations';
import { CurrentWeather } from '../services/weather';
import { theme } from '../src/styles/theme';
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
  lastUpdatedText?: string | null;
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
  lastUpdatedText = null,
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
            {!isLocationLoading && lastUpdatedText && (
              <Text style={styles.updatedAt}>마지막 업데이트: {lastUpdatedText}</Text>
            )}
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    ...theme.shadow.card,
  },
  label: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
  },
  starButton: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.warning,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  location: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  refreshButton: {
    backgroundColor: theme.colors.success,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: theme.colors.card,
    fontSize: 15,
    fontWeight: '600',
  },
  temperature: {
    fontSize: theme.fontSize.temperature,
    fontWeight: '300',
    color: theme.colors.text,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  condition: {
    fontSize: theme.fontSize.subtitle,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  detail: {
    fontSize: 15,
    color: theme.colors.subText,
    marginBottom: theme.spacing.xs,
  },
  updatedAt: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
    marginTop: theme.spacing.md,
  },
});
