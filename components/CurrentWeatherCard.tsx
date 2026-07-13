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
              <View style={styles.temperatureRow}>
                <Text style={styles.temperatureValue}>{weather.temperature}</Text>
                <Text style={styles.temperatureUnit}>°</Text>
              </View>
              <View style={styles.conditionRow}>
                <WeatherIcon icon={weather.icon} size={theme.layout.heroIconSize} />
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

        <View style={styles.buttonRow}>
          <Pressable
            style={[styles.actionButton, isLocationLoading && styles.actionButtonDisabled]}
            onPress={onReturnToCurrentLocation}
            disabled={isLocationLoading}
          >
            {showHeroRefreshing ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={styles.actionButtonText}>현재 위치</Text>
            )}
          </Pressable>
          <Pressable
            style={[
              styles.actionButton,
              (isLocationLoading || !canRefresh) && styles.actionButtonDisabled,
            ]}
            onPress={onRefresh}
            disabled={isLocationLoading || !canRefresh}
          >
            {showHeroRefreshing ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
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
    borderColor: theme.colors.heroActionBorder,
    overflow: 'hidden',
    position: 'relative',
    ...theme.shadow.hero,
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
    marginBottom: theme.spacing.md,
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
    backgroundColor: theme.colors.heroActionSurface,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.heroActionBorder,
  },
  favoriteIcon: {
    fontSize: theme.layout.favoriteIconSize + 1,
    lineHeight: theme.layout.favoriteIconSize + 3,
  },
  favoriteIconInactive: {
    color: theme.colors.textSecondary,
  },
  favoriteIconActive: {
    color: theme.colors.primary,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  temperatureValue: {
    ...theme.typography.hero.temperature,
    textAlign: 'center',
  },
  temperatureUnit: {
    ...theme.typography.hero.temperatureUnit,
    marginTop: 10,
    marginLeft: 1,
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  condition: {
    ...theme.typography.hero.condition,
    textAlign: 'center',
  },
  summary: {
    ...theme.typography.hero.summary,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
    zIndex: 1,
  },
  actionButton: {
    backgroundColor: theme.colors.heroActionSurface,
    borderRadius: theme.radius.full,
    borderWidth: 1,
    borderColor: theme.colors.heroActionBorder,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    minWidth: 96,
    minHeight: theme.layout.heroActionMinSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonDisabled: {
    opacity: 0.55,
  },
  actionButtonText: {
    color: theme.colors.text,
    fontSize: theme.fontSize.caption,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
  updatedAt: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
    textAlign: 'center',
  },
  footerStatusSlot: {
    minHeight: 18,
    marginTop: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  updatingStatus: {
    ...theme.typography.loading.heroUpdating,
  },
});
