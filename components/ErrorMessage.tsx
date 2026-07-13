import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../src/styles/theme';

export type ErrorCardType = 'network' | 'location' | 'api';

export const ErrorMessages = {
  network: '인터넷 연결을 확인해주세요. 잠시 후 다시 시도해주세요.',
  location: '현재 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.',
  weather: '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
} as const;

const ERROR_CONTENT: Record<
  ErrorCardType,
  { icon: string; title: string; description: string }
> = {
  network: {
    icon: '📡',
    title: '인터넷 연결을 확인해주세요',
    description: 'Wi-Fi 또는 모바일 데이터 연결 상태를 확인한 후 다시 시도해 주세요.',
  },
  location: {
    icon: '📍',
    title: '위치 권한이 필요합니다',
    description: '설정에서 위치 권한을 허용하면 현재 위치의 날씨를 확인할 수 있습니다.',
  },
  api: {
    icon: '🌤',
    title: '날씨 정보를 불러오지 못했습니다',
    description: '잠시 후 다시 시도해 주세요.',
  },
};

export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) return true;
  if (error instanceof Error) {
    return /network request failed|failed to fetch|internet|network/i.test(error.message);
  }
  return false;
}

export function resolveErrorType(message: string): ErrorCardType {
  if (message === ErrorMessages.location) return 'location';
  if (message === ErrorMessages.network) return 'network';
  return 'api';
}

type Props = {
  type?: ErrorCardType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  compact?: boolean;
};

export default function ErrorMessage({
  type = 'api',
  title,
  description,
  onRetry,
  compact = false,
}: Props) {
  const content = ERROR_CONTENT[type];
  const displayTitle = title ?? content.title;
  const displayDescription =
    description === '' ? null : description ?? content.description;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <Text style={styles.icon}>{content.icon}</Text>
      <Text style={styles.title}>{displayTitle}</Text>
      {displayDescription ? (
        <Text style={styles.description}>{displayDescription}</Text>
      ) : null}
      {onRetry ? (
        <Pressable
          style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
          onPress={onRetry}
        >
          <Text style={styles.retryButtonText}>다시 시도</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    paddingHorizontal: theme.layout.cardPadding,
    paddingVertical: theme.spacing.xl,
    marginBottom: theme.layout.cardGap,
    borderWidth: 1,
    borderColor: theme.colors.errorBorder,
    gap: theme.spacing.sm,
    ...theme.shadow.soft,
  },
  cardCompact: {
    backgroundColor: theme.colors.errorSurface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  icon: {
    ...theme.typography.errorState.icon,
    marginBottom: theme.spacing.xs,
  },
  title: {
    ...theme.typography.errorState.title,
  },
  description: {
    ...theme.typography.errorState.description,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.full,
    minHeight: theme.layout.errorActionMinHeight,
    minWidth: 120,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  retryButtonPressed: {
    opacity: 0.85,
  },
  retryButtonText: {
    ...theme.typography.errorState.buttonText,
  },
});
