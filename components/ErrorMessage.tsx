import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

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
    backgroundColor: '#FEF2F2',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  text: {
    fontSize: 15,
    color: theme.colors.danger,
    textAlign: 'center',
  },
});
