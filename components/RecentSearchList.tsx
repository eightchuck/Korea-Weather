import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RecentSearchItem } from '../services/recentSearch';
import { theme } from '../src/styles/theme';

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
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.subText,
  },
  clearAllButton: {
    fontSize: theme.fontSize.caption,
    color: theme.colors.danger,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  recentMain: {
    flex: 1,
  },
  listText: {
    fontSize: theme.fontSize.body,
    color: theme.colors.text,
  },
  removeButton: {
    fontSize: 18,
    color: theme.colors.subText,
    paddingHorizontal: theme.spacing.sm,
  },
});
