import { Pressable, StyleSheet, Text, View } from 'react-native';
import { FavoriteLocation } from '../services/favoriteLocations';
import { CurrentWeather } from '../services/weather';
import { theme } from '../src/styles/theme';
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
        <Pressable
          style={({ pressed }) => [
            styles.starButtonWrap,
            pressed && styles.pressed,
          ]}
          onPress={() => onToggleFavorite(location)}
          hitSlop={4}
        >
          <Text style={styles.starButton}>{isFavorite ? '★' : '☆'}</Text>
        </Pressable>
      </View>
      <Text style={styles.location} numberOfLines={2}>
        {location.name}
      </Text>
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
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    marginBottom: theme.layout.cardGap,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
  },
  starButton: {
    fontSize: 24,
    color: theme.colors.warning,
  },
  starButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.layout.favoriteTouchSize,
    minHeight: theme.layout.favoriteTouchSize,
  },
  pressed: {
    opacity: theme.interaction.pressedOpacity,
  },
  location: {
    fontSize: theme.fontSize.subtitle,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  weather: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    flex: 1,
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
