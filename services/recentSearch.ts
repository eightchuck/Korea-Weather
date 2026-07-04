import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'recent_searches';
const MAX_ITEMS = 5;

export type RecentSearchItem = {
  name: string;
  lat: number;
  lon: number;
};

export async function getRecentSearches(): Promise<RecentSearchItem[]> {
  try {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    if (!json) return [];
    const parsed = JSON.parse(json) as RecentSearchItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function addRecentSearch(location: RecentSearchItem): Promise<RecentSearchItem[]> {
  const current = await getRecentSearches();
  const filtered = current.filter((item) => item.name !== location.name);
  const updated = [location, ...filtered].slice(0, MAX_ITEMS);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeRecentSearch(name: string): Promise<RecentSearchItem[]> {
  const current = await getRecentSearches();
  const updated = current.filter((item) => item.name !== name);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export async function clearRecentSearches(): Promise<RecentSearchItem[]> {
  await AsyncStorage.removeItem(STORAGE_KEY);
  return [];
}
