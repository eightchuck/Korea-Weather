import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getLocationSuggestions, KoreanLocation } from '../data/koreanLocations';
import { FavoriteLocation } from '../services/favoriteLocations';
import { RecentSearchItem } from '../services/recentSearch';
import { CityWeatherItem } from '../services/weather';

type Props = {
  searchCity: string;
  onChangeSearchCity: (text: string) => void;
  onSearch: () => void;
  onSearchCity: (city: string) => void;
  searchLoading: boolean;
  searchError: string;
  searchedWeather: CityWeatherItem | null;
  recentSearches: RecentSearchItem[];
  onRecentSearchPress: (item: RecentSearchItem) => void;
  favoriteLocations: FavoriteLocation[];
  onToggleFavorite: (location: FavoriteLocation) => void;
  onFavoritePress: (location: FavoriteLocation) => void;
  currentSearchLocation: FavoriteLocation | null;
  isFavorite: boolean;
};

export default function SearchWeatherCard({
  searchCity,
  onChangeSearchCity,
  onSearch,
  onSearchCity,
  searchLoading,
  searchError,
  searchedWeather,
  recentSearches,
  onRecentSearchPress,
  favoriteLocations,
  onToggleFavorite,
  onFavoritePress,
  currentSearchLocation,
  isFavorite,
}: Props) {
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  const suggestions = useMemo(
    () => getLocationSuggestions(searchCity),
    [searchCity],
  );

  const showSuggestions =
    suggestionsVisible && searchCity.trim().length > 0 && suggestions.length > 0;

  useEffect(() => {
    if (searchedWeather && !searchLoading) {
      setSuggestionsVisible(false);
    }
  }, [searchedWeather, searchLoading]);

  const handleChangeText = (text: string) => {
    onChangeSearchCity(text);
    setSuggestionsVisible(text.trim().length > 0);
  };

  const handleSelectSuggestion = (location: KoreanLocation) => {
    setSuggestionsVisible(false);
    onSearchCity(location.displayName);
  };

  const searchedDisplayName =
    searchedWeather?.displayName ||
    searchedWeather?.city ||
    searchCity;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.label}>도시 검색</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={searchCity}
            onChangeText={handleChangeText}
            placeholder="도시명 입력"
            placeholderTextColor="#8e8e93"
          />
          <Pressable style={styles.searchButton} onPress={onSearch}>
            <Text style={styles.searchButtonText}>검색</Text>
          </Pressable>
        </View>

        {showSuggestions && (
          <View style={styles.suggestionList}>
            {suggestions.map((location) => (
              <Pressable
                key={location.displayName}
                style={styles.suggestionItem}
                onPress={() => handleSelectSuggestion(location)}
              >
                <Text style={styles.suggestionText}>{location.displayName}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {recentSearches.length > 0 && !showSuggestions && (
          <View style={styles.recentList}>
            <Text style={styles.sectionTitle}>최근 검색</Text>
            {recentSearches.map((item) => (
              <Pressable
                key={`${item.name}-${item.lat}-${item.lon}`}
                style={styles.listItem}
                onPress={() => onRecentSearchPress(item)}
              >
                <Text style={styles.listText}>{item.name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {favoriteLocations.length > 0 && !showSuggestions && (
          <View style={styles.recentList}>
            <Text style={styles.sectionTitle}>즐겨찾기</Text>
            {favoriteLocations.map((item) => (
              <View key={`${item.name}-${item.lat}-${item.lon}`} style={styles.favoriteRow}>
                <Pressable style={styles.favoriteMain} onPress={() => onFavoritePress(item)}>
                  <Text style={styles.listText}>{item.name}</Text>
                </Pressable>
                <Pressable onPress={() => onToggleFavorite(item)}>
                  <Text style={styles.starActive}>★</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}

        {searchLoading && <Text style={styles.detail}>검색 중...</Text>}
        {searchError ? <Text style={styles.searchError}>{searchError}</Text> : null}
      </View>

      {searchedWeather && (
        <View style={styles.card}>
          <View style={styles.resultHeader}>
            <Text style={styles.label}>검색 결과</Text>
            {currentSearchLocation && (
              <Pressable onPress={() => onToggleFavorite(currentSearchLocation)}>
                <Text style={styles.starButton}>{isFavorite ? '★' : '☆'}</Text>
              </Pressable>
            )}
          </View>
          <Text style={styles.row}>
            {searchedDisplayName}  {Math.round(searchedWeather.temp)}°C  {searchedWeather.weather}
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: '#8e8e93',
    marginBottom: 6,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  starButton: {
    fontSize: 24,
    color: '#ff9500',
  },
  detail: {
    fontSize: 15,
    color: '#8e8e93',
    marginBottom: 4,
    marginTop: 8,
  },
  row: {
    fontSize: 16,
    color: '#1c1c1e',
    marginBottom: 8,
  },
  searchRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 8,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1c1c1e',
    marginRight: 8,
  },
  searchButton: {
    backgroundColor: '#007aff',
    borderRadius: 10,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchError: {
    fontSize: 15,
    color: '#ff3b30',
    marginTop: 12,
  },
  suggestionList: {
    width: '100%',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  suggestionItem: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  suggestionText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  recentList: {
    width: '100%',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8e8e93',
    marginTop: 12,
    marginBottom: 4,
    alignSelf: 'flex-start',
  },
  listItem: {
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  listText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  favoriteMain: {
    flex: 1,
  },
  starActive: {
    fontSize: 20,
    color: '#ff9500',
    paddingHorizontal: 4,
  },
});
