import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Keyboard,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native';
import { getLocationSuggestions, KoreanLocation } from '../data/koreanLocations';
import { FavoriteLocation } from '../services/favoriteLocations';
import { RecentSearchItem } from '../services/recentSearch';
import { theme } from '../src/styles/theme';
import EmptyState from './EmptyState';
import ErrorMessage from './ErrorMessage';
import RecentSearchList from './RecentSearchList';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const RESULTS_ANIMATION_IN_MS = 220;
const RESULTS_ANIMATION_OUT_MS = 180;
const RESULTS_SLIDE_OFFSET = 10;
const MIN_EMPTY_QUERY_LENGTH = 2;
const ROW_LOADING_OPACITY = 0.8;

function getFavoriteKey(location: FavoriteLocation) {
  return `${location.name}-${location.lat}-${location.lon}`;
}

function getLocationDisplayParts(displayName: string): { title: string; subtitle: string | null } {
  const parts = displayName.trim().split(/\s+/);

  if (parts.length === 1) {
    return { title: parts[0], subtitle: '대한민국' };
  }

  const title = parts[parts.length - 1];
  const subtitle = parts.slice(0, -1).join(' ');
  return { title, subtitle };
}

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
  loadingFavoriteKey?: string | null;
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
  loadingFavoriteKey = null,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const [isFavoritesExpanded, setIsFavoritesExpanded] = useState(false);
  const [loadingSearchSelection, setLoadingSearchSelection] = useState<string | null>(null);
  const resultsOpacity = useRef(new Animated.Value(0)).current;
  const resultsTranslateY = useRef(new Animated.Value(-RESULTS_SLIDE_OFFSET)).current;
  const trimmedSearch = searchCity.trim();

  const suggestions = useMemo(
    () => getLocationSuggestions(searchCity),
    [searchCity],
  );

  const showSuggestions = trimmedSearch.length > 0 && suggestions.length > 0;
  const showEmptyResults =
    trimmedSearch.length >= MIN_EMPTY_QUERY_LENGTH &&
    suggestions.length === 0 &&
    !searchLoading;
  const shouldShowResults = showSuggestions || showEmptyResults;
  const showRecentSearches = trimmedSearch.length === 0;

  useEffect(() => {
    if (shouldShowResults) {
      resultsOpacity.setValue(0);
      resultsTranslateY.setValue(-RESULTS_SLIDE_OFFSET);

      Animated.parallel([
        Animated.timing(resultsOpacity, {
          toValue: 1,
          duration: RESULTS_ANIMATION_IN_MS,
          useNativeDriver: true,
        }),
        Animated.timing(resultsTranslateY, {
          toValue: 0,
          duration: RESULTS_ANIMATION_IN_MS,
          useNativeDriver: true,
        }),
      ]).start();
      return;
    }

    Animated.parallel([
      Animated.timing(resultsOpacity, {
        toValue: 0,
        duration: RESULTS_ANIMATION_OUT_MS,
        useNativeDriver: true,
      }),
      Animated.timing(resultsTranslateY, {
        toValue: -RESULTS_SLIDE_OFFSET,
        duration: RESULTS_ANIMATION_OUT_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shouldShowResults, resultsOpacity, resultsTranslateY]);

  useEffect(() => {
    if (!searchLoading) {
      setLoadingSearchSelection(null);
    }
  }, [searchLoading]);

  const handleChangeText = (text: string) => {
    onChangeSearchCity(text);
  };

  const handleClearSearch = () => {
    onChangeSearchCity('');
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSubmitSearch = () => {
    Keyboard.dismiss();
    onSearch();
  };

  const handleSelectSuggestion = (location: KoreanLocation) => {
    if (searchLoading) return;
    setLoadingSearchSelection(location.displayName);
    Keyboard.dismiss();
    onSearchCity(location.displayName);
  };

  const handleToggleFavoritesExpanded = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        250,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setIsFavoritesExpanded((prev) => !prev);
  };

  const favoriteCount = favoriteLocations.length;
  const showFavoriteList = isFavoritesExpanded && favoriteCount > 0;

  return (
    <View style={styles.wrapper}>
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Pressable
            style={({ pressed }) => [
              styles.searchIconButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSubmitSearch}
          >
            <Text style={styles.searchIcon}>⌕</Text>
          </Pressable>
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            value={searchCity}
            onChangeText={handleChangeText}
            placeholder="도시명 검색"
            placeholderTextColor={theme.colors.subText}
            returnKeyType="search"
            onSubmitEditing={handleSubmitSearch}
            blurOnSubmit
          />
          <Pressable
            style={({ pressed }) => [
              styles.clearButton,
              searchCity.length === 0 && styles.clearButtonHidden,
              pressed && searchCity.length > 0 && styles.pressed,
            ]}
            onPress={handleClearSearch}
            disabled={searchCity.length === 0}
            hitSlop={8}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </Pressable>
        </View>

        <Animated.View
          style={[
            styles.searchDropdown,
            !shouldShowResults && styles.searchDropdownHidden,
            {
              opacity: resultsOpacity,
              transform: [{ translateY: resultsTranslateY }],
            },
          ]}
          pointerEvents={shouldShowResults ? 'auto' : 'none'}
        >
          <ScrollView
            style={styles.resultsScroll}
            contentContainerStyle={styles.resultsScrollContent}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="none"
            showsVerticalScrollIndicator={false}
          >
            {showSuggestions &&
              suggestions.map((location, index) => {
                const { title, subtitle } = getLocationDisplayParts(location.displayName);
                const isRowLoading =
                  searchLoading && loadingSearchSelection === location.displayName;

                return (
                  <View key={location.displayName}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.resultRow,
                        isRowLoading && styles.resultRowLoading,
                        pressed && !isRowLoading && styles.resultRowPressed,
                      ]}
                      onPress={() => handleSelectSuggestion(location)}
                      disabled={isRowLoading}
                    >
                      <View style={styles.resultTextBlock}>
                        <Text style={styles.resultTitle}>{title}</Text>
                        {subtitle ? <Text style={styles.resultRegion}>{subtitle}</Text> : null}
                      </View>
                      <View style={styles.rowActionSlot}>
                        {isRowLoading ? (
                          <ActivityIndicator size="small" color={theme.colors.primary} />
                        ) : (
                          <Text style={styles.chevron}>›</Text>
                        )}
                      </View>
                    </Pressable>
                    {index < suggestions.length - 1 && <View style={styles.resultDivider} />}
                  </View>
                );
              })}

            {showEmptyResults && (
              <EmptyState
                icon="⌕"
                title="검색 결과가 없습니다"
                description="다른 지역명으로 다시 검색해 보세요"
                compact
              />
            )}
          </ScrollView>
        </Animated.View>
      </View>

      {recentSearches.length > 0 && (
        <View style={[styles.panel, !showRecentSearches && styles.panelHidden]}>
          <RecentSearchList
            recentSearches={recentSearches}
            onRecentSearchPress={onRecentSearchPress}
            onRemoveRecentSearch={onRemoveRecentSearch}
            onClearRecentSearches={onClearRecentSearches}
          />
        </View>
      )}

      <View style={styles.panel}>
        <View style={styles.favoriteHeader}>
          <Text style={styles.favoriteHeaderTitle}>
            ★ 즐겨찾기 ({favoriteCount})
          </Text>
          {favoriteCount > 0 && (
            <Pressable
              style={({ pressed }) => [
                styles.favoriteToggleButton,
                pressed && styles.pressed,
              ]}
              onPress={handleToggleFavoritesExpanded}
              hitSlop={8}
            >
              <Text style={styles.favoriteToggleIcon}>
                {isFavoritesExpanded ? '▲' : '▼'}
              </Text>
            </Pressable>
          )}
        </View>
        {favoriteCount === 0 ? (
          <EmptyState
            icon="☆"
            title="즐겨찾기한 지역이 없습니다"
            description="날씨 카드의 ★ 버튼으로 자주 확인하는 지역을 추가해 보세요"
            compact
          />
        ) : null}
        {showFavoriteList &&
          favoriteLocations.map((item) => {
            const itemKey = getFavoriteKey(item);
            const isRowLoading = searchLoading && loadingFavoriteKey === itemKey;

            return (
              <View
                key={itemKey}
                style={[styles.favoriteRow, isRowLoading && styles.resultRowLoading]}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.favoriteMain,
                    pressed && !isRowLoading && styles.rowPressed,
                  ]}
                  onPress={() => onFavoritePress(item)}
                  disabled={isRowLoading}
                >
                  <Text style={styles.listText}>{item.name}</Text>
                </Pressable>
                <View style={styles.rowActionSlot}>
                  {isRowLoading ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : null}
                </View>
                <Pressable
                  style={({ pressed }) => [
                    styles.favoriteStarButton,
                    pressed && styles.pressed,
                  ]}
                  onPress={() => onToggleFavorite(item)}
                  hitSlop={4}
                >
                  <Text style={styles.starActive}>★</Text>
                </Pressable>
              </View>
            );
          })}
      </View>

      {searchLoading && !loadingSearchSelection && (
        <Text style={styles.detail}>검색 중...</Text>
      )}
      {searchError ? (
        <ErrorMessage
          type="api"
          title={searchError}
          description={
            searchError === '도시명을 입력해주세요.'
              ? ''
              : searchError === '도시를 찾을 수 없습니다.'
                ? '다른 지역명으로 다시 검색해 보세요.'
                : '잠시 후 다시 시도해 주세요.'
          }
          compact
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.layout.cardGap,
  },
  searchWrapper: {
    width: '100%',
  },
  searchBar: {
    width: '100%',
    height: theme.layout.searchHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.soft,
  },
  searchDropdown: {
    width: '100%',
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadow.soft,
  },
  searchDropdownHidden: {
    maxHeight: 0,
    marginTop: 0,
    borderWidth: 0,
  },
  searchIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    fontSize: 22,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
  },
  clearButtonHidden: {
    opacity: 0,
  },
  clearButtonText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.subText,
  },
  resultsScroll: {
    maxHeight: theme.layout.searchResultsMaxHeight,
  },
  resultsScrollContent: {
    flexGrow: 1,
  },
  panel: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: theme.layout.cardPadding,
    marginTop: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadow.soft,
  },
  panelHidden: {
    height: 0,
    opacity: 0,
    overflow: 'hidden',
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
    borderWidth: 0,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.layout.searchResultRowHeight,
    paddingHorizontal: theme.layout.searchResultPaddingHorizontal,
  },
  resultRowPressed: {
    backgroundColor: theme.colors.primaryTint,
  },
  rowPressed: {
    backgroundColor: theme.colors.primaryTint,
  },
  pressed: {
    opacity: theme.interaction.pressedOpacity,
  },
  resultRowLoading: {
    opacity: ROW_LOADING_OPACITY,
  },
  resultTextBlock: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: theme.spacing.sm,
  },
  resultTitle: {
    ...theme.typography.searchResult.title,
  },
  resultRegion: {
    ...theme.typography.searchResult.region,
    marginTop: 2,
  },
  chevron: {
    fontSize: theme.layout.searchResultChevronSize,
    lineHeight: theme.layout.searchResultChevronSize + 2,
    color: theme.colors.textSecondary,
    fontWeight: '400',
  },
  rowActionSlot: {
    width: theme.layout.rowActionSize,
    height: theme.layout.rowActionSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultDivider: {
    height: 1,
    backgroundColor: theme.colors.divider,
    opacity: 0.7,
    marginHorizontal: theme.layout.searchResultPaddingHorizontal,
  },
  detail: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  favoriteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: theme.typography.inputPlaceholder.lineHeight,
  },
  favoriteHeaderTitle: {
    ...theme.typography.inputPlaceholder,
    flex: 1,
  },
  favoriteToggleButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: theme.typography.inputPlaceholder.lineHeight,
    paddingHorizontal: theme.spacing.sm,
  },
  favoriteToggleIcon: {
    ...theme.typography.inputPlaceholder,
    lineHeight: theme.typography.inputPlaceholder.lineHeight,
  },
  listText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  favoriteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    marginTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.divider,
  },
  favoriteMain: {
    flex: 1,
    justifyContent: 'center',
    minHeight: theme.layout.heroActionMinSize,
  },
  favoriteStarButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.layout.favoriteTouchSize,
    minHeight: theme.layout.favoriteTouchSize,
  },
  starActive: {
    fontSize: 20,
    color: theme.colors.warning,
    paddingHorizontal: theme.spacing.xs,
  },
});
