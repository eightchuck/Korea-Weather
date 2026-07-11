import { useEffect, useMemo, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { theme } from '../styles/theme';

type AnimationType = 'clear' | 'rain' | 'snow';

type Props = {
  weatherCondition: string | null | undefined;
};

type DropConfig = {
  left: number;
  startY: number;
  width: number;
  height: number;
  delay: number;
  opacity: number;
};

type SnowConfig = {
  left: number;
  startY: number;
  size: number;
  delay: number;
  opacity: number;
  drift: number;
};

const RAIN_CYCLE_MS = 1600;
const SNOW_CYCLE_MS = 4200;
const HERO_ANIM_HEIGHT = 300;

const RAIN_DROPS: DropConfig[] = [
  { left: 14, startY: -18, width: 1, height: 14, delay: 0, opacity: 0.14 },
  { left: 28, startY: -28, width: 2, height: 16, delay: 0.12, opacity: 0.18 },
  { left: 42, startY: -12, width: 1, height: 12, delay: 0.24, opacity: 0.12 },
  { left: 58, startY: -22, width: 2, height: 18, delay: 0.08, opacity: 0.2 },
  { left: 72, startY: -16, width: 1, height: 15, delay: 0.32, opacity: 0.16 },
  { left: 84, startY: -26, width: 2, height: 14, delay: 0.18, opacity: 0.14 },
  { left: 92, startY: -10, width: 1, height: 13, delay: 0.4, opacity: 0.11 },
];

const SNOW_FLAKES: SnowConfig[] = [
  { left: 12, startY: -8, size: 4, delay: 0, opacity: 0.22, drift: 6 },
  { left: 24, startY: -14, size: 5, delay: 0.15, opacity: 0.28, drift: -4 },
  { left: 38, startY: -6, size: 3, delay: 0.3, opacity: 0.18, drift: 5 },
  { left: 52, startY: -12, size: 6, delay: 0.1, opacity: 0.32, drift: -6 },
  { left: 66, startY: -10, size: 4, delay: 0.45, opacity: 0.24, drift: 4 },
  { left: 78, startY: -16, size: 5, delay: 0.25, opacity: 0.26, drift: -5 },
  { left: 88, startY: -8, size: 3, delay: 0.55, opacity: 0.2, drift: 3 },
];

function resolveAnimationType(condition: string | null | undefined): AnimationType | null {
  if (!condition) return null;

  if (condition === '맑음' || condition.includes('맑음')) {
    return 'clear';
  }

  if (condition === '눈' || condition.startsWith('눈')) {
    return 'snow';
  }

  if (condition === '비' || condition === '이슬비' || condition.includes('비')) {
    return 'rain';
  }

  return null;
}

function RainAnimation() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: RAIN_CYCLE_MS,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <View style={styles.layer} pointerEvents="none" accessible={false}>
      {RAIN_DROPS.map((drop, index) => {
        const translateY = progress.interpolate({
          inputRange: [drop.delay, 1],
          outputRange: [drop.startY, HERO_ANIM_HEIGHT],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={`rain-${index}`}
            style={[
              styles.rainDrop,
              {
                left: `${drop.left}%`,
                width: drop.width,
                height: drop.height,
                opacity: drop.opacity,
                transform: [{ translateY }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

function SnowAnimation() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: SNOW_CYCLE_MS,
        useNativeDriver: true,
      }),
    );

    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <View style={styles.layer} pointerEvents="none" accessible={false}>
      {SNOW_FLAKES.map((flake, index) => {
        const translateY = progress.interpolate({
          inputRange: [flake.delay, 1],
          outputRange: [flake.startY, HERO_ANIM_HEIGHT],
          extrapolate: 'clamp',
        });

        const translateX = progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, flake.drift, -flake.drift * 0.5],
        });

        return (
          <Animated.View
            key={`snow-${index}`}
            style={[
              styles.snowFlake,
              {
                left: `${flake.left}%`,
                width: flake.size,
                height: flake.size,
                borderRadius: flake.size / 2,
                opacity: flake.opacity,
                transform: [{ translateY }, { translateX }],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export default function WeatherAnimation({ weatherCondition }: Props) {
  const animationType = useMemo(
    () => resolveAnimationType(weatherCondition),
    [weatherCondition],
  );

  if (!animationType || animationType === 'clear') return null;

  if (animationType === 'rain') return <RainAnimation />;
  return <SnowAnimation />;
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: theme.radius.xl,
    zIndex: 0,
  },
  rainDrop: {
    position: 'absolute',
    top: 0,
    borderRadius: theme.radius.full,
    backgroundColor: theme.colors.primary,
  },
  snowFlake: {
    position: 'absolute',
    top: 0,
    backgroundColor: theme.colors.card,
  },
});
