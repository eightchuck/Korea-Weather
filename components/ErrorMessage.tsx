import { StyleSheet, Text, View } from 'react-native';

type Props = {
  message: string;
};

export default function ErrorMessage({ message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff5f5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcaca',
  },
  text: {
    fontSize: 15,
    color: '#ff3b30',
    textAlign: 'center',
  },
});
