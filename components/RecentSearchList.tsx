import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RecentSearchItem } from '../services/recentSearch';

type Props = {
  recentSearches: RecentSearchItem[];
  onRecentSearchPress: (item: RecentSearchItem) => void;
  onRemoveRecentSearch: (item: RecentSearchItem) => void;
  onClearRecentSearches: () => void;
};

export default function RecentSearchList({
  recentSearches,
  onRecentSearchPress,
  onRemoveRecentSearch,
  onClearRecentSearches,
}: Props) {
  if (recentSearches.length === 0) return null;

  return (
    <View style={styles.recentList}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>최근 검색</Text>
        <Pressable onPress={onClearRecentSearches}>
          <Text style={styles.clearAllButton}>전체삭제</Text>
        </Pressable>
      </View>
      {recentSearches.map((item) => (
        <View key={`${item.name}-${item.lat}-${item.lon}`} style={styles.recentRow}>
          <Pressable style={styles.recentMain} onPress={() => onRecentSearchPress(item)}>
            <Text style={styles.listText}>{item.name}</Text>
          </Pressable>
          <Pressable onPress={() => onRemoveRecentSearch(item)}>
            <Text style={styles.removeButton}>✕</Text>
          </Pressable>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  recentList: {
    width: '100%',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 14,
    color: '#8e8e93',
  },
  clearAllButton: {
    fontSize: 14,
    color: '#ff3b30',
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  recentMain: {
    flex: 1,
  },
  listText: {
    fontSize: 16,
    color: '#1c1c1e',
  },
  removeButton: {
    fontSize: 18,
    color: '#8e8e93',
    paddingHorizontal: 8,
  },
});
