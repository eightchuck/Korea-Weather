import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

type Props = {
  message?: string;
};

export default function LoadingMessage({ message = '날씨 정보를 불러오는 중입니다...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="small" color={theme.colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.card,
  },
  text: {
    fontSize: 15,
    color: theme.colors.text,
    marginLeft: 10,
  },
});
