import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import CityWeatherList from './components/CityWeatherList';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ErrorMessage from './components/ErrorMessage';
import ForecastCard from './components/ForecastCard';
import LoadingMessage from './components/LoadingMessage';
import SearchWeatherCard from './components/SearchWeatherCard';
import WeeklyForecastCard from './components/WeeklyForecastCard';
import {
  FavoriteLocation,
  getFavoriteLocations,
  isFavoriteLocation,
  removeFavoriteLocation,
  saveFavoriteLocation,
} from './services/favoriteLocations';
import {
  addRecentSearch,
  getRecentSearches,
  RecentSearchItem,
} from './services/recentSearch';
import {
  CityWeatherItem,
  CurrentWeather,
  getCityWeather,
  getCityWeatherList,
  getCurrentWeather,
  getHourlyWeather,
  getWeeklyWeather,
  HourlyWeatherItem,
  WeeklyWeatherItem,
} from './services/weather';

const WEATHER_ERROR = '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.';
const LOCATION_ERROR = '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.';

function formatAddress(address: Location.LocationGeocodedAddress) {
  const region = address.region;
  const second = address.subregion || address.city;

  if (!region && !second) return '주소를 불러올 수 없습니다';
  if (!region) return second!;
  if (!second || region === second) return region;
  return `${region} ${second}`;
}

export default function App() {
  const [locationText, setLocationText] = useState('위치 확인 중...');
  const [weather, setWeather] = useState<CurrentWeather | null>(null);
  const [weatherMessage, setWeatherMessage] = useState('날씨 정보를 불러오는 중...');
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeatherItem[]>([]);
  const [weeklyWeather, setWeeklyWeather] = useState<WeeklyWeatherItem[]>([]);
  const [cityWeatherList, setCityWeatherList] = useState<CityWeatherItem[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchedWeather, setSearchedWeather] = useState<CityWeatherItem | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [currentSearchLocation, setCurrentSearchLocation] = useState<FavoriteLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    getRecentSearches().then(setRecentSearches);
    getFavoriteLocations().then(setFavoriteLocations);
  }, []);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationText('위치 권한이 필요합니다');
          setWeatherMessage('날씨 정보를 가져오지 못했습니다');
          setErrorMessage(LOCATION_ERROR);
          return;
        }

        let coords: Location.LocationObjectCoords;
        try {
          coords = (await Location.getCurrentPositionAsync({})).coords;
        } catch (error) {
          console.error(error);
          setLocationText('위치를 가져올 수 없습니다');
          setWeatherMessage('날씨 정보를 가져오지 못했습니다');
          setErrorMessage(LOCATION_ERROR);
          return;
        }

        const [address] = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });

        setLocationText(address ? formatAddress(address) : '주소를 불러올 수 없습니다');

        try {
          const data = await getCurrentWeather(coords.latitude, coords.longitude);
          setWeather(data);
          setWeatherMessage('');
        } catch (error) {
          console.error(error);
          setWeather(null);
          setWeatherMessage('날씨 정보를 가져오지 못했습니다');
          setErrorMessage(WEATHER_ERROR);
        }

        try {
          const hourly = await getHourlyWeather(coords.latitude, coords.longitude);
          setHourlyWeather(hourly);
        } catch (error) {
          console.error(error);
        }

        try {
          const weekly = await getWeeklyWeather(coords.latitude, coords.longitude);
          setWeeklyWeather(weekly);
        } catch (error) {
          console.error(error);
        }

        try {
          const cities = await getCityWeatherList();
          setCityWeatherList(cities);
        } catch (error) {
          console.error(error);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const searchByCoords = async (location: FavoriteLocation) => {
    setSearchCity(location.name);
    setIsLoading(true);
    setSearchLoading(true);
    setErrorMessage(null);
    setSearchError('');
    setSearchedWeather(null);

    try {
      const data = await getCurrentWeather(location.lat, location.lon);
      const result: CityWeatherItem = {
        city: location.name,
        temp: data.temperature,
        weather: data.condition,
        displayName: location.name,
        lat: location.lat,
        lon: location.lon,
      };
      setSearchedWeather(result);
      setCurrentSearchLocation(location);

      const updatedRecent = await addRecentSearch(location);
      setRecentSearches(updatedRecent);
    } catch (error) {
      console.error(error);
      setErrorMessage(WEATHER_ERROR);
      setSearchError('날씨 정보를 가져오지 못했습니다.');
      setCurrentSearchLocation(null);
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearchCity = async (city: string) => {
    const trimmed = city.trim();
    if (!trimmed) {
      setSearchError('도시명을 입력해주세요.');
      setSearchedWeather(null);
      setCurrentSearchLocation(null);
      return;
    }

    setSearchCity(trimmed);
    setIsLoading(true);
    setSearchLoading(true);
    setErrorMessage(null);
    setSearchError('');
    setSearchedWeather(null);

    try {
      const result = await getCityWeather(trimmed);
      setSearchedWeather(result);

      if (result.lat != null && result.lon != null) {
        const location: FavoriteLocation = {
          name: result.displayName || result.city,
          lat: result.lat,
          lon: result.lon,
        };
        setCurrentSearchLocation(location);

        const updatedRecent = await addRecentSearch(location);
        setRecentSearches(updatedRecent);
      } else {
        setCurrentSearchLocation(null);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(WEATHER_ERROR);
      setSearchError('도시를 찾을 수 없습니다.');
      setCurrentSearchLocation(null);
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    handleSearchCity(searchCity);
  };

  const handleRecentSearchPress = (item: RecentSearchItem) => {
    searchByCoords(item);
  };

  const handleFavoritePress = (location: FavoriteLocation) => {
    searchByCoords(location);
  };

  const handleToggleFavorite = async (location: FavoriteLocation) => {
    const exists = await isFavoriteLocation(location.name);
    const updated = exists
      ? await removeFavoriteLocation(location.name)
      : await saveFavoriteLocation(location);
    setFavoriteLocations(updated);
  };

  const isFavorite = currentSearchLocation
    ? favoriteLocations.some((item) => item.name === currentSearchLocation.name)
    : false;

  const showInitialLoading = isLoading && !weather && !searchedWeather;

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.appTitle}>Korea Weather</Text>
        <Text style={styles.subtitle}>오늘의 날씨를 확인하세요</Text>
      </View>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {isLoading && !showInitialLoading && <LoadingMessage message="날씨 정보를 불러오는 중입니다..." />}

      {showInitialLoading ? (
        <LoadingMessage />
      ) : (
        <>
          <CurrentWeatherCard
            locationText={locationText}
            weather={weather}
            weatherMessage={weatherMessage}
          />

          <SearchWeatherCard
            searchCity={searchCity}
            onChangeSearchCity={setSearchCity}
            onSearch={handleSearch}
            onSearchCity={handleSearchCity}
            searchLoading={searchLoading}
            searchError={searchError}
            searchedWeather={searchedWeather}
            recentSearches={recentSearches}
            onRecentSearchPress={handleRecentSearchPress}
            favoriteLocations={favoriteLocations}
            onToggleFavorite={handleToggleFavorite}
            onFavoritePress={handleFavoritePress}
            currentSearchLocation={currentSearchLocation}
            isFavorite={isFavorite}
          />

          <ForecastCard hourlyWeather={hourlyWeather} />

          <WeeklyForecastCard weeklyWeather={weeklyWeather} />

          <CityWeatherList cityWeatherList={cityWeatherList} />
        </>
      )}

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 32,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
});
