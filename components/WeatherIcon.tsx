import { Image, StyleSheet } from 'react-native';
import { getWeatherIconUrl } from '../services/weatherIcon';

type Props = {
  icon: string;
  size?: number;
};

export default function WeatherIcon({ icon, size = 50 }: Props) {
  return (
    <Image
      source={{ uri: getWeatherIconUrl(icon) }}
      style={[styles.icon, { width: size, height: size }]}
      resizeMode="contain"
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    marginRight: 4,
  },
});
