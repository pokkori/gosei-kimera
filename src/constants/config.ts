export const GAME_CONFIG = {
  MAX_TURNS: 6,
  SLOT_BONUS_MULTIPLIER: 1.5,
  CRITICAL_CHANCE: 0.10,
  CRITICAL_MULTIPLIER: 1.5,
  DAMAGE_MIN_MULTIPLIER: 0.8,
  DAMAGE_MAX_MULTIPLIER: 1.2,
  DRAW_THRESHOLD: 0.05,
  DEFAULT_INVENTORY_LIMIT: 50,
  GACHA_NORMAL_COST: 100,
  GACHA_PREMIUM_COST: 500,
  DAILY_AD_LIMIT: 3,
  SELL_COIN_VALUES: {
    common: 10,
    uncommon: 25,
    rare: 60,
    epic: 150,
    legendary: 400,
  } as Record<string, number>,
} as const;

export const AD_UNITS = {
  ios: {
    banner_arena: 'ca-app-pub-XXXX/YYYY',
    banner_shop: 'ca-app-pub-XXXX/YYYY',
    interstitial: 'ca-app-pub-XXXX/YYYY',
    rewarded_battle: 'ca-app-pub-XXXX/YYYY',
    rewarded_shop: 'ca-app-pub-XXXX/YYYY',
  },
  android: {
    banner_arena: 'ca-app-pub-XXXX/YYYY',
    banner_shop: 'ca-app-pub-XXXX/YYYY',
    interstitial: 'ca-app-pub-XXXX/YYYY',
    rewarded_battle: 'ca-app-pub-XXXX/YYYY',
    rewarded_shop: 'ca-app-pub-XXXX/YYYY',
  },
} as const;
