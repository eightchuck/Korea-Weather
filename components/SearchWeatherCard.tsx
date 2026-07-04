import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { getLocationSuggestions, KoreanLocation } from '../data/koreanLocations';
import { FavoriteLocation } from '../services/favoriteLocations';
import { RecentSearchItem } from '../services/recentSearch';
import RecentSearchList from './RecentSearchList';

type Props = {
  searchCity: string;
  onChangeSearchCity: (text: string) => void;
  onSearch: () => void;
  onSearchCity: (city: string) => void;
  searchLoading: boolean;
  searchError: string;
  recentSearches: RecentSearchItem[];
  onRecentSearchPress: (item: RecentSearchItem) => void;
  onRemoveRecentSearch: (item: RecentSearchItem) => void;
  onClearRecentSearches: () => void;
  favoriteLocations: FavoriteLocation[];
  onToggleFavorite: (location: FavoriteLocation) => void;
  onFavoritePress: (location: FavoriteLocation) => void;
};

export default function SearchWeatherCard({
  searchCity,
  onChangeSearchCity,
  onSearch,
  onSearchCity,
  searchLoading,
  searchError,
  recentSearches,
  onRecentSearchPress,
  onRemoveRecentSearch,
  onClearRecentSearches,
  favoriteLocations,
  onToggleFavorite,
  onFavoritePress,
}: Props) {
  const trimmedSearch = searchCity.trim();

  const suggestions = useMemo(
    () => getLocationSuggestions(searchCity),
    [searchCity],
  );

  const showSuggestions = trimmedSearch.length > 0 && suggestions.length > 0;
  const showRecentSearches = trimmedSearch.length === 0;

  const handleChangeText = (text: string) => {
    onChangeSearchCity(text);
  };

  const handleSelectSuggestion = (location: KoreanLocation) => {
    onSearchCity(location.displayName);
  };

  return (
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

      {showRecentSearches && (
        <RecentSearchList
          recentSearches={recentSearches}
          onRecentSearchPress={onRecentSearchPress}
          onRemoveRecentSearch={onRemoveRecentSearch}
          onClearRecentSearches={onClearRecentSearches}
        />
      )}

      {favoriteLocations.length > 0 && (
        <View style={styles.sectionList}>
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
  detail: {
    fontSize: 15,
    color: '#8e8e93',
    marginBottom: 4,
    marginTop: 8,
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
  sectionList: {
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
