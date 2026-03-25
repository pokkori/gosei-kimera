import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const LAYOUT = {
  window: { width, height },
  card: { width: 72, height: 96, gap: 8 },
  slot: { width: 90, height: 110, dropRadius: 60 },
  mergeStation: { width: 200, height: 100 },
  chimera: {
    small: { width: 80, height: 106 },
    medium: { width: 160, height: 213 },
    large: { width: 240, height: 320 },
  },
  padding: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },
} as const;
