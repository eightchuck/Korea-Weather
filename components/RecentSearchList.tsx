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
        <Pressable
          style={({ pressed }) => [styles.clearAllButtonWrap, pressed && styles.pressed]}
          onPress={onClearRecentSearches}
          hitSlop={4}
        >
          <Text style={styles.clearAllButton}>전체삭제</Text>
        </Pressable>
      </View>
      {recentSearches.map((item) => (
        <View key={`${item.name}-${item.lat}-${item.lon}`} style={styles.recentRow}>
          <Pressable
            style={({ pressed }) => [
              styles.recentMain,
              pressed && styles.rowPressed,
            ]}
            onPress={() => onRecentSearchPress(item)}
          >
            <Text style={styles.listText} numberOfLines={1} ellipsizeMode="tail">
              {item.name}
            </Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.removeButtonWrap,
              pressed && styles.pressed,
            ]}
            onPress={() => onRemoveRecentSearch(item)}
            hitSlop={4}
          >
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
    ...theme.typography.section.inCardCaption,
  },
  clearAllButton: {
    ...theme.typography.label,
    color: theme.colors.danger,
  },
  clearAllButtonWrap: {
    paddingVertical: theme.spacing.xs,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    minHeight: theme.layout.listRowHeight,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  recentMain: {
    flex: 1,
    justifyContent: 'center',
    minWidth: 0,
    minHeight: theme.layout.listRowHeight,
  },
  rowPressed: {
    backgroundColor: theme.colors.primaryTint,
  },
  pressed: {
    opacity: theme.interaction.pressedOpacity,
  },
  listText: {
    ...theme.typography.weekly.day,
    flexShrink: 1,
  },
  removeButton: {
    fontSize: 18,
    color: theme.colors.subText,
    paddingHorizontal: theme.spacing.sm,
  },
  removeButtonWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: theme.layout.favoriteTouchSize,
    minHeight: theme.layout.favoriteTouchSize,
  },
});
