import { useEffect, useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { Keyboard, ScrollView, StyleSheet, Text, View } from 'react-native';
import CityWeatherList from './components/CityWeatherList';
import CurrentWeatherCard from './components/CurrentWeatherCard';
import ErrorMessage from './components/ErrorMessage';
import ForecastCard from './components/ForecastCard';
import LoadingMessage from './components/LoadingMessage';
import SearchResultCard from './components/SearchResultCard';
import SearchWeatherCard from './components/SearchWeatherCard';
import Toast from './components/Toast';
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
  clearRecentSearches,
  getRecentSearches,
  removeRecentSearch,
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
import { formatLastUpdated } from './utils/formatDateTime';

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
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [favoriteLocations, setFavoriteLocations] = useState<FavoriteLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<FavoriteLocation | null>(null);
  const [isManualLocation, setIsManualLocation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastUpdatedText, setLastUpdatedText] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (message: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    getRecentSearches().then(setRecentSearches);
    getFavoriteLocations().then(setFavoriteLocations);
  }, []);

  const loadWeatherByLocation = async (
    lat: number,
    lon: number,
    locationName: string,
  ): Promise<boolean> => {
    setLocationText(locationName);

    try {
      const data = await getCurrentWeather(lat, lon);
      setWeather(data);
      setWeatherMessage('');
    } catch (error) {
      console.error(error);
      setWeather(null);
      setWeatherMessage('날씨 정보를 가져오지 못했습니다');
      setErrorMessage(WEATHER_ERROR);
      return false;
    }

    try {
      const hourly = await getHourlyWeather(lat, lon);
      setHourlyWeather(hourly);
    } catch (error) {
      console.error(error);
    }

    try {
      const weekly = await getWeeklyWeather(lat, lon);
      setWeeklyWeather(weekly);
    } catch (error) {
      console.error(error);
    }

    setLastUpdatedText(formatLastUpdated(new Date()));
    return true;
  };

  const loadCurrentLocationWeather = async (): Promise<boolean> => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsManualLocation(false);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationText('위치 권한이 필요합니다');
        setWeatherMessage('날씨 정보를 가져오지 못했습니다');
        setErrorMessage(LOCATION_ERROR);
        return false;
      }

      let coords: Location.LocationObjectCoords;
      try {
        coords = (await Location.getCurrentPositionAsync({})).coords;
      } catch (error) {
        console.error(error);
        setLocationText('위치를 가져올 수 없습니다');
        setWeatherMessage('날씨 정보를 가져오지 못했습니다');
        setErrorMessage(LOCATION_ERROR);
        return false;
      }

      const [address] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      const addressText = address ? formatAddress(address) : '주소를 불러올 수 없습니다';
      const success = await loadWeatherByLocation(
        coords.latitude,
        coords.longitude,
        addressText,
      );

      if (success) {
        setSelectedLocation({
          name: addressText,
          lat: coords.latitude,
          lon: coords.longitude,
        });
      }

      return success;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await loadCurrentLocationWeather();

      try {
        const cities = await getCityWeatherList();
        setCityWeatherList(cities);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const clearSearchState = () => {
    setSearchCity('');
    setSearchError('');
  };

  const handleReturnToCurrentLocation = async () => {
    const success = await loadCurrentLocationWeather();
    if (success) {
      clearSearchState();
      showToast('현재 위치 날씨로 돌아왔습니다.');
    }
  };

  const handleRefresh = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const success = await loadWeatherByLocation(
        selectedLocation.lat,
        selectedLocation.lon,
        selectedLocation.name,
      );
      if (success) {
        showToast('날씨 정보를 새로고침했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applySelectedLocation = (location: FavoriteLocation) => {
    setSelectedLocation(location);
    setIsManualLocation(true);
  };

  const applyLocationSearch = async (location: FavoriteLocation) => {
    setSearchCity(location.name);
    setIsLoading(true);
    setSearchLoading(true);
    setErrorMessage(null);
    setSearchError('');

    try {
      const success = await loadWeatherByLocation(location.lat, location.lon, location.name);
      if (success) {
        applySelectedLocation(location);
        const updatedRecent = await addRecentSearch(location);
        setRecentSearches(updatedRecent);
      } else {
        setSearchError('날씨 정보를 가져오지 못했습니다.');
        setSelectedLocation(null);
        setIsManualLocation(false);
      }
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearchCity = async (city: string) => {
    const trimmed = city.trim();
    if (!trimmed) {
      setSearchError('도시명을 입력해주세요.');
      return;
    }

    setSearchCity(trimmed);
    setIsLoading(true);
    setSearchLoading(true);
    setErrorMessage(null);
    setSearchError('');

    try {
      const result = await getCityWeather(trimmed);
      if (result.lat == null || result.lon == null) {
        setSearchError('도시를 찾을 수 없습니다.');
        return;
      }

      const location: FavoriteLocation = {
        name: result.displayName || result.city,
        lat: result.lat,
        lon: result.lon,
      };

      const success = await loadWeatherByLocation(location.lat, location.lon, location.name);
      if (success) {
        applySelectedLocation(location);
        const updatedRecent = await addRecentSearch(location);
        setRecentSearches(updatedRecent);
        Keyboard.dismiss();
      } else {
        setSearchError('날씨 정보를 가져오지 못했습니다.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(WEATHER_ERROR);
      setSearchError('도시를 찾을 수 없습니다.');
    } finally {
      setIsLoading(false);
      setSearchLoading(false);
    }
  };

  const handleSearch = () => {
    handleSearchCity(searchCity);
  };

  const handleRecentSearchPress = (item: RecentSearchItem) => {
    applyLocationSearch(item);
  };

  const handleClearRecentSearches = async () => {
    const updated = await clearRecentSearches();
    setRecentSearches(updated);
    showToast('최근 검색을 모두 삭제했습니다.');
  };

  const handleRemoveRecentSearch = async (item: RecentSearchItem) => {
    const updated = await removeRecentSearch(item.name);
    setRecentSearches(updated);
    showToast('최근 검색을 삭제했습니다.');
  };

  const handleFavoritePress = (location: FavoriteLocation) => {
    applyLocationSearch(location);
  };

  const handleToggleFavorite = async (location: FavoriteLocation) => {
    if (!location.name || location.lat == null || location.lon == null) return;

    const exists = await isFavoriteLocation(location.name);
    const updated = exists
      ? await removeFavoriteLocation(location.name)
      : await saveFavoriteLocation(location);
    setFavoriteLocations(updated);
    showToast(
      exists ? '즐겨찾기에서 제거되었습니다.' : '즐겨찾기에 추가되었습니다.',
    );
  };

  const isFavorite = selectedLocation
    ? favoriteLocations.some((item) => item.name === selectedLocation.name)
    : false;

  const showInitialLoading = isLoading && !weather;

  return (
    <View style={styles.app}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.header}>
        <Text style={styles.appTitle}>Korea Weather</Text>
        <Text style={styles.subtitle}>오늘의 날씨를 확인하세요</Text>
      </View>

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {isLoading && !showInitialLoading && (
        <LoadingMessage message="날씨 정보를 불러오는 중입니다..." />
      )}

      {showInitialLoading ? (
        <LoadingMessage />
      ) : (
        <>
          <CurrentWeatherCard
            locationText={locationText}
            weather={weather}
            weatherMessage={weatherMessage}
            onReturnToCurrentLocation={handleReturnToCurrentLocation}
            onRefresh={handleRefresh}
            isLocationLoading={isLoading}
            canRefresh={selectedLocation != null}
            isManualLocation={isManualLocation}
            selectedLocation={selectedLocation}
            isFavorite={isFavorite}
            onToggleFavorite={handleToggleFavorite}
            lastUpdatedText={lastUpdatedText}
          />

          <SearchWeatherCard
            searchCity={searchCity}
            onChangeSearchCity={setSearchCity}
            onSearch={handleSearch}
            onSearchCity={handleSearchCity}
            searchLoading={searchLoading}
            searchError={searchError}
            recentSearches={recentSearches}
            onRecentSearchPress={handleRecentSearchPress}
            onRemoveRecentSearch={handleRemoveRecentSearch}
            onClearRecentSearches={handleClearRecentSearches}
            favoriteLocations={favoriteLocations}
            onToggleFavorite={handleToggleFavorite}
            onFavoritePress={handleFavoritePress}
          />

          {isManualLocation && selectedLocation && weather && (
            <SearchResultCard
              location={selectedLocation}
              weather={weather}
              isFavorite={isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          )}

          <ForecastCard hourlyWeather={hourlyWeather} />

          <WeeklyForecastCard weeklyWeather={weeklyWeather} />

          <CityWeatherList cityWeatherList={cityWeatherList} />
        </>
      )}

      <StatusBar style="auto" />
      </ScrollView>

      <Toast message={toastMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  scrollView: {
    flex: 1,
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
