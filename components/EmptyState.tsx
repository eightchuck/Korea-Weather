import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

type Props = {
  icon?: string;
  title: string;
  description?: string;
  compact?: boolean;
  surface?: boolean;
};

export default function EmptyState({
  icon,
  title,
  description,
  compact = false,
  surface = false,
}: Props) {
  return (
    <View
      style={[
        styles.container,
        compact && styles.containerCompact,
        surface && styles.containerSurface,
      ]}
    >
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.layout.cardPadding,
    paddingVertical: theme.layout.emptyStatePaddingVertical,
    gap: theme.spacing.sm,
  },
  containerCompact: {
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.xs,
  },
  containerSurface: {
    backgroundColor: theme.colors.emptyStateSurface,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.emptyStateBorder,
  },
  icon: {
    ...theme.typography.emptyState.icon,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.emptyState.title,
  },
  description: {
    ...theme.typography.emptyState.description,
  },
});
