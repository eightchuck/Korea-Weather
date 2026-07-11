import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { FavoriteLocation } from '../services/favoriteLocations';
import { CurrentWeather } from '../services/weather';
import WeatherAnimation from '../src/components/WeatherAnimation';
import { getWeatherHeroBackgroundColor, theme } from '../src/styles/theme';
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
  forecastHigh?: number | null;
  forecastLow?: number | null;
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
  forecastHigh = null,
  forecastLow = null,
}: Props) {
  const summaryParts = weather
    ? [
        `체감 ${weather.feelsLike}°`,
        forecastHigh != null ? `최고 ${forecastHigh}°` : null,
        forecastLow != null ? `최저 ${forecastLow}°` : null,
      ].filter(Boolean)
    : [];

  const canFavorite =
    selectedLocation != null &&
    selectedLocation.name.length > 0 &&
    selectedLocation.lat != null &&
    selectedLocation.lon != null;

  const locationTypeLabel = isManualLocation ? '선택한 위치' : '현재 위치';
  const showHeroRefreshing = isLocationLoading && weather != null;
  const heroBackgroundColor = getWeatherHeroBackgroundColor(weather?.condition);

  return (
    <>
      <View style={[styles.hero, { backgroundColor: heroBackgroundColor }]}>
        <WeatherAnimation weatherCondition={weather?.condition} />
        <View style={styles.heroContent}>
          <Text style={styles.locationType}>📍 {locationTypeLabel}</Text>

          <View style={styles.locationNameSection}>
            <Text style={styles.locationName} numberOfLines={2}>
              {locationText}
            </Text>
            {canFavorite && onToggleFavorite && (
              <Pressable
                style={styles.favoriteButton}
                onPress={() => onToggleFavorite(selectedLocation)}
                hitSlop={4}
              >
                <Text
                  style={[
                    styles.favoriteIcon,
                    isFavorite ? styles.favoriteIconActive : styles.favoriteIconInactive,
                  ]}
                >
                  {isFavorite ? '★' : '☆'}
                </Text>
              </Pressable>
            )}
          </View>

          {weather ? (
            <>
              <Text style={styles.temperature}>{weather.temperature}°</Text>
              <View style={styles.conditionRow}>
                <WeatherIcon icon={weather.icon} size={30} />
                <Text style={styles.condition}>{weather.condition}</Text>
              </View>
              {summaryParts.length > 0 && (
                <Text style={styles.summary}>{summaryParts.join('  ·  ')}</Text>
              )}
            </>
          ) : (
            <Text style={styles.condition}>{weatherMessage}</Text>
          )}
        </View>

        <View style={styles.heroExtension} />

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.actionButton, isLocationLoading && styles.actionButtonDisabled]}
            onPress={onReturnToCurrentLocation}
            disabled={isLocationLoading}
          >
            {showHeroRefreshing ? (
              <ActivityIndicator size="small" color={theme.colors.card} />
            ) : (
              <Text style={styles.actionButtonText}>현재 위치</Text>
            )}
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
            {showHeroRefreshing ? (
              <ActivityIndicator size="small" color={theme.colors.card} />
            ) : (
              <Text style={styles.actionButtonText}>새로고침</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.footerStatusSlot}>
          {showHeroRefreshing ? (
            <Text style={styles.updatingStatus}>최신 날씨를 업데이트하고 있어요</Text>
          ) : lastUpdatedText ? (
            <Text style={styles.updatedAt}>마지막 업데이트: {lastUpdatedText}</Text>
          ) : null}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  hero: {
    borderRadius: theme.radius.xl,
    paddingTop: theme.layout.heroPaddingTop,
    paddingBottom: theme.layout.heroPaddingBottom,
    paddingHorizontal: theme.layout.cardPadding,
    marginBottom: theme.layout.cardGap,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    position: 'relative',
  },
  heroContent: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  locationType: {
    ...theme.typography.hero.locationType,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  locationNameSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: theme.layout.favoriteTouchSize / 2,
    marginBottom: theme.spacing.lg,
  },
  locationName: {
    ...theme.typography.hero.locationName,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -(theme.layout.favoriteTouchSize / 2),
    width: theme.layout.favoriteTouchSize,
    height: theme.layout.favoriteTouchSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIcon: {
    fontSize: theme.layout.favoriteIconSize,
    lineHeight: theme.layout.favoriteIconSize + 2,
  },
  favoriteIconInactive: {
    color: theme.colors.textSecondary,
  },
  favoriteIconActive: {
    color: theme.colors.primary,
  },
  temperature: {
    ...theme.typography.hero.temperature,
    textAlign: 'center',
    letterSpacing: -1,
    marginBottom: theme.spacing.sm,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  condition: {
    ...theme.typography.hero.condition,
    textAlign: 'center',
  },
  summary: {
    ...theme.typography.hero.summary,
    textAlign: 'center',
  },
  heroExtension: {
    width: '100%',
    minHeight: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minWidth: 88,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshButton: {
    backgroundColor: theme.colors.success,
  },
  actionButtonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: theme.colors.card,
    fontSize: theme.fontSize.caption,
    fontWeight: '600',
  },
  updatedAt: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
    textAlign: 'center',
  },
  footerStatusSlot: {
    minHeight: 18,
    marginTop: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updatingStatus: {
    ...theme.typography.loading.heroUpdating,
  },
});
