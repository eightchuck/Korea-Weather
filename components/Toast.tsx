import { StyleSheet, Text, View } from 'react-native';

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
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 999,
  },
  toast: {
    backgroundColor: 'rgba(28, 28, 30, 0.92)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  text: {
    color: '#ffffff',
    fontSize: 15,
    textAlign: 'center',
  },
});
