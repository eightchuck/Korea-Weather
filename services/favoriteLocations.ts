import AsyncStorage from '@react-native-async-storage/async-storage';

export const FAVORITE_LOCATIONS_KEY = 'favorite_locations';
const MAX_ITEMS = 10;

export type FavoriteLocation = {
  name: string;
  lat: number;
  lon: number;
};

export async function getFavoriteLocations(): Promise<FavoriteLocation[]> {
  try {
    const json = await AsyncStorage.getItem(FAVORITE_LOCATIONS_KEY);
    if (!json) return [];
    const parsed = JSON.parse(json) as FavoriteLocation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveFavoriteLocation(location: FavoriteLocation): Promise<FavoriteLocation[]> {
  const current = await getFavoriteLocations();
  const filtered = current.filter((item) => item.name !== location.name);
  const updated = [location, ...filtered].slice(0, MAX_ITEMS);
  await AsyncStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export async function removeFavoriteLocation(locationName: string): Promise<FavoriteLocation[]> {
  const current = await getFavoriteLocations();
  const updated = current.filter((item) => item.name !== locationName);
  await AsyncStorage.setItem(FAVORITE_LOCATIONS_KEY, JSON.stringify(updated));
  return updated;
}

export async function isFavoriteLocation(locationName: string): Promise<boolean> {
  const current = await getFavoriteLocations();
  return current.some((item) => item.name === locationName);
}
