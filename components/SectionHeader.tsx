import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: theme.spacing.sectionTop,
    marginBottom: theme.spacing.sectionBottom,
  },
  title: {
    fontSize: theme.fontSize.sectionHeader,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'left',
  },
});
