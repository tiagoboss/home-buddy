import { useCallback } from 'react';

type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

const vibrationPatterns: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 10],
  warning: [25, 50, 25],
  error: [50, 100, 50],
};

export const useHaptic = () => {
  const trigger = useCallback((type: HapticType = 'medium') => {
    // Try Vibration API (works on Android, some iOS Safari)
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(vibrationPatterns[type]);
      } catch (e) {
        // Vibration not supported or failed
      }
    }
  }, []);

  const success = useCallback(() => trigger('success'), [trigger]);
  const warning = useCallback(() => trigger('warning'), [trigger]);
  const error = useCallback(() => trigger('error'), [trigger]);
  const light = useCallback(() => trigger('light'), [trigger]);
  const medium = useCallback(() => trigger('medium'), [trigger]);
  const heavy = useCallback(() => trigger('heavy'), [trigger]);

  return { trigger, success, warning, error, light, medium, heavy };
};
