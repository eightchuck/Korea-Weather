import { KoreanLocation, matchKoreanLocation } from '../data/koreanLocations';

export type { KoreanLocation };

const API_KEY = process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

const WEATHER_KO: Record<string, string> = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Drizzle: '이슬비',
  Thunderstorm: '뇌우',
  Snow: '눈',
  Mist: '안개',
  Smoke: '연기',
  Haze: '실안개',
  Dust: '먼지',
  Fog: '안개',
  Sand: '모래먼지',
  Ash: '화산재',
  Squall: '돌풍',
  Tornado: '토네이도',
};

function toKoreanWeather(main: string, description: string): string {
  if (WEATHER_KO[main]) return WEATHER_KO[main];

  const capitalized = description
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return WEATHER_KO[capitalized] ?? description;
}

export type CurrentWeather = {
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
};

export type HourlyWeatherItem = {
  hour: string;
  temperature: number;
  condition: string;
};

export type WeeklyWeatherItem = {
  day: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
};

type ForecastItem = {
  dt: number;
  main: { temp: number; temp_min: number; temp_max: number };
  weather: { main: string; description: string }[];
};

const DAY_NAMES = ['일', '월', '화', '수', '목', '금', '토'];

async function fetchForecastList(
  latitude: number,
  longitude: number,
): Promise<ForecastItem[]> {
  const url =
    `https://api.openweathermap.org/data/2.5/forecast` +
    `?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`;

  const safeUrl = url.replace(API_KEY ?? '', '***');
  console.log('Forecast API URL:', safeUrl);

  const response = await fetch(url);
  if (!response.ok) {
    const responseText = await response.text();
    console.log('Forecast API status:', response.status);
    console.log('Forecast API response:', responseText);
    throw new Error('예보 정보를 불러올 수 없습니다');
  }

  const data = await response.json();
  return data.list;
}

export async function getHourlyWeather(
  latitude: number,
  longitude: number,
): Promise<HourlyWeatherItem[]> {
  const list = await fetchForecastList(latitude, longitude);

  return list.slice(0, 5).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      hour: `${date.getHours()}시`,
      temperature: Math.round(item.main.temp),
      condition: toKoreanWeather(item.weather[0].main, item.weather[0].description),
    };
  });
}

export async function getWeeklyWeather(
  latitude: number,
  longitude: number,
): Promise<WeeklyWeatherItem[]> {
  const list = await fetchForecastList(latitude, longitude);

  const dayMap = new Map<string, ForecastItem[]>();
  for (const item of list) {
    const key = new Date(item.dt * 1000).toISOString().slice(0, 10);
    if (!dayMap.has(key)) dayMap.set(key, []);
    dayMap.get(key)!.push(item);
  }

  return Array.from(dayMap.values())
    .slice(0, 5)
    .map((items) => {
      const maxTemp = Math.round(Math.max(...items.map((i) => i.main.temp_max)));
      const minTemp = Math.round(Math.min(...items.map((i) => i.main.temp_min)));
      const mid = items[Math.floor(items.length / 2)];
      const date = new Date(items[0].dt * 1000);

      return {
        day: DAY_NAMES[date.getDay()],
        maxTemp,
        minTemp,
        condition: toKoreanWeather(mid.weather[0].main, mid.weather[0].description),
      };
    });
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
): Promise<CurrentWeather> {
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric&lang=kr`;

  const safeUrl = url.replace(API_KEY ?? '', '***');
  console.log('Weather API URL:', safeUrl);

  const response = await fetch(url);
  if (!response.ok) {
    const responseText = await response.text();
    console.log('Weather API status:', response.status);
    console.log('Weather API response:', responseText);
    throw new Error('날씨 정보를 불러올 수 없습니다');
  }

  const data = await response.json();

  return {
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: toKoreanWeather(data.weather[0].main, data.weather[0].description),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };
}

const CITY_LIST = [
  { city: '서울', latitude: 37.5665, longitude: 126.9780 },
  { city: '인천', latitude: 37.4563, longitude: 126.7052 },
  { city: '부산', latitude: 35.1796, longitude: 129.0756 },
  { city: '대전', latitude: 36.3504, longitude: 127.3845 },
  { city: '광주', latitude: 35.1595, longitude: 126.8526 },
  { city: '대구', latitude: 35.8714, longitude: 128.6014 },
  { city: '울산', latitude: 35.5384, longitude: 129.3114 },
  { city: '제주', latitude: 33.4996, longitude: 126.5312 },
];

export type CityWeatherItem = {
  city: string;
  temp: number;
  weather: string;
  displayName?: string;
  lat?: number;
  lon?: number;
};

export function resolveKoreanLocation(searchText: string): KoreanLocation | null {
  return matchKoreanLocation(searchText);
}

export async function getCityWeatherList(): Promise<CityWeatherItem[]> {
  return Promise.all(
    CITY_LIST.map(async (item) => {
      const data = await getCurrentWeather(item.latitude, item.longitude);
      return {
        city: item.city,
        temp: data.temperature,
        weather: data.condition,
      };
    }),
  );
}

export async function getCityWeather(cityName: string): Promise<CityWeatherItem> {
  const trimmed = cityName.trim();
  const location = resolveKoreanLocation(cityName);

  if (location) {
    const data = await getCurrentWeather(location.lat, location.lon);
    return {
      city: location.displayName,
      temp: data.temperature,
      weather: data.condition,
      displayName: location.displayName,
      lat: location.lat,
      lon: location.lon,
    };
  }

  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?q=${encodeURIComponent(trimmed)}&appid=${API_KEY}&units=metric&lang=kr`;

  const safeUrl = url.replace(API_KEY ?? '', '***');
  console.log('City Search API URL:', safeUrl);

  const response = await fetch(url);
  if (!response.ok) {
    const responseText = await response.text();
    console.log('City Search API status:', response.status);
    console.log('City Search API response:', responseText);
    throw new Error('도시를 찾을 수 없습니다');
  }

  const data = await response.json();
  const displayName = data.name || cityName.trim();

  return {
    city: displayName,
    temp: Math.round(data.main.temp),
    weather: toKoreanWeather(data.weather[0].main, data.weather[0].description),
    displayName,
    lat: data.coord.lat,
    lon: data.coord.lon,
  };
}
