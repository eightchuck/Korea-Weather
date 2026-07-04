import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

type Props = {
  message: string | null;
};

export default function Toast({ message }: Props) {
  if (!message) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.toast}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 40,
    left: theme.spacing.xl,
    right: theme.spacing.xl,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    backgroundColor: 'rgba(31, 41, 55, 0.92)',
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  text: {
    color: theme.colors.card,
    fontSize: 15,
    textAlign: 'center',
  },
});
