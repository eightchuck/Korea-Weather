const ICON_BASE_URL = 'https://openweathermap.org/img/wn';

export function getWeatherIconUrl(icon: string): string {
  return `${ICON_BASE_URL}/${icon}@2x.png`;
}
