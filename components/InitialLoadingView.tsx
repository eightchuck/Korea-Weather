import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

export default function InitialLoadingView() {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Weather of Daehan</Text>
      <Text style={styles.symbol}>☀️</Text>
      <ActivityIndicator size="small" color={theme.colors.primary} style={styles.indicator} />
      <Text style={styles.mainMessage}>현재 위치의 날씨를 불러오고 있어요</Text>
      <Text style={styles.subMessage}>잠시만 기다려 주세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 360,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
    paddingHorizontal: theme.layout.screenPadding,
  },
  appName: {
    ...theme.typography.loading.appName,
    marginBottom: theme.spacing.md,
  },
  symbol: {
    fontSize: theme.fontSize.title,
    marginBottom: theme.spacing.lg,
  },
  indicator: {
    marginBottom: theme.spacing.lg,
  },
  mainMessage: {
    ...theme.typography.loading.main,
    marginBottom: theme.spacing.sm,
  },
  subMessage: {
    ...theme.typography.loading.sub,
  },
});
