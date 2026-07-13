import { StyleSheet, Text, View } from 'react-native';
import { CityWeatherItem } from '../services/weather';
import { theme } from '../src/styles/theme';
import EmptyState from './EmptyState';
import SectionHeader from './SectionHeader';
import WeatherIcon from './WeatherIcon';

type Props = {
  cityWeatherList: CityWeatherItem[];
  showEmpty?: boolean;
};

export default function CityWeatherList({ cityWeatherList, showEmpty = false }: Props) {
  if (cityWeatherList.length === 0 && !showEmpty) return null;

  return (
    <View style={styles.section}>
      <SectionHeader title="전국 날씨" />
      {cityWeatherList.length > 0 ? (
        <View style={styles.card}>
          {cityWeatherList.map((item, index) => (
            <View key={index}>
              <View style={styles.row}>
                <Text style={styles.city}>{item.city}</Text>
                <View style={styles.iconArea}>
                  <WeatherIcon icon={item.icon} size={theme.layout.cityIconSize} />
                </View>
                <View style={styles.spacer} />
                <Text style={styles.temp}>{Math.round(item.temp)}°</Text>
              </View>
              {index < cityWeatherList.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.card}>
          <EmptyState
            title="표시할 전국 날씨 데이터가 없습니다"
            description="잠시 후 다시 확인해 주세요"
            compact
            surface
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: theme.layout.cardGap,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.card,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.cityRowHeight,
  },
  city: {
    ...theme.typography.city.name,
    minWidth: 44,
  },
  iconArea: {
    width: theme.layout.cityIconAreaWidth,
    height: theme.layout.cityRowHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    flex: 1,
  },
  temp: {
    ...theme.typography.city.temperature,
    minWidth: 44,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    opacity: 0.7,
  },
});
