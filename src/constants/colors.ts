export const COLORS = {
  bg: {
    primary: '#0D0D1A',
    secondary: '#1A1A3E',
    surface: '#252550',
    overlay: 'rgba(0,0,0,0.7)',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0CC',
    muted: '#6B6B8D',
  },
  rarity: {
    common: '#9E9E9E',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FF9800',
    legendaryGlow: '#FFD700',
  },
  species: {
    dragon: '#FF6B35',
    phoenix: '#FF2D55',
    kraken: '#30D5C8',
  },
  stat: {
    atk: '#FF4444',
    hp: '#44FF44',
    spd: '#4488FF',
  },
  hpBar: {
    high: '#4CAF50',
    medium: '#FFC107',
    low: '#F44336',
  },
  ui: {
    accent: '#7C4DFF',
    accentLight: '#B388FF',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    border: '#3D3D6B',
    cardBorder: '#4A4A7D',
  },
} as const;
