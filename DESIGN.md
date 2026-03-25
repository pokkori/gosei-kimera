# 合成キメラ / Chimera Forge - 詳細設計書

> **Version**: 1.0.0
> **作成日**: 2026-03-20
> **技術スタック**: React Native (Expo SDK 53) + TypeScript
> **対象プラットフォーム**: iOS 16+ / Android 10+
> **コンセプト**: 生き物の「部位」をドラッグ&ドロップで合成し、最強キメラを作って闘技場で戦わせる
> **参考ゲーム**: Suika Game(マージ中毒性) x Spore(パーツ組み合わせ創造性) x Marvel Snap(3分決着の高速バトル)

---

## 目次

1. [プロジェクト構成](#1-プロジェクト構成)
2. [TypeScript型定義](#2-typescript型定義)
3. [画面設計](#3-画面設計)
4. [ゲームロジック](#4-ゲームロジック)
5. [部位データ（全45部位）](#5-部位データ全45部位)
6. [収益化設計](#6-収益化設計)
7. [アプリ特有機能](#7-アプリ特有機能)
8. [データ永続化](#8-データ永続化)
9. [シェア機能](#9-シェア機能)
10. [キメラ描画システム](#10-キメラ描画システム)

---

## 1. プロジェクト構成

### 1.1 ディレクトリ構造

```
chimera-forge/
├── app/                              # Expo Router (file-based routing)
│   ├── _layout.tsx                   # Root layout (GestureHandlerRootView + providers)
│   ├── index.tsx                     # タイトル画面
│   ├── main.tsx                      # メイン画面（インベントリ+マージ台+キメラプレビュー）
│   ├── arena.tsx                     # 闘技場画面（対戦アニメーション）
│   ├── codex.tsx                     # 部位図鑑画面
│   └── shop.tsx                      # ショップ画面（IAP）
├── src/
│   ├── components/
│   │   ├── PartCard.tsx              # 部位カードコンポーネント（ドラッグ可能）
│   │   ├── PartSlot.tsx              # 装備スロットコンポーネント（ドロップ受容）
│   │   ├── MergeStation.tsx          # マージ台（2枚重ねで合成）
│   │   ├── ChimeraPreview.tsx        # キメラSVGプレビュー
│   │   ├── ChimeraCanvas.tsx         # キメラ描画Canvas（シェア用スクリーンショット）
│   │   ├── BattleAnimation.tsx       # 対戦アニメーション
│   │   ├── BattleResultModal.tsx     # 対戦結果モーダル
│   │   ├── PartInventory.tsx         # 部位インベントリリスト
│   │   ├── RarityBadge.tsx           # レア度バッジ表示
│   │   ├── StatsBar.tsx              # ステータスバー（攻撃/HP/速度）
│   │   ├── MergeEffect.tsx           # マージ時パーティクルエフェクト
│   │   ├── CodexGrid.tsx             # 図鑑グリッド表示
│   │   ├── ShopItem.tsx              # ショップ商品カード
│   │   ├── TournamentBracket.tsx     # トーナメント表
│   │   ├── AdBanner.tsx              # AdMobバナー広告
│   │   └── RewardedAdButton.tsx      # リワード広告ボタン
│   ├── hooks/
│   │   ├── useGameState.ts           # ゲーム状態管理（zustand）
│   │   ├── useMerge.ts              # マージロジック
│   │   ├── useBattle.ts             # 対戦ロジック
│   │   ├── useDragDrop.ts           # ドラッグ&ドロップ制御
│   │   ├── useHaptics.ts            # ハプティクスフィードバック
│   │   ├── useAds.ts                # 広告管理
│   │   ├── usePurchases.ts          # IAP/RevenueCat
│   │   ├── useNotifications.ts      # プッシュ通知
│   │   └── useAudio.ts              # 効果音・BGM
│   ├── data/
│   │   ├── parts.ts                 # 全45部位定義データ
│   │   ├── enemies.ts               # CPU対戦相手データ（階層別）
│   │   └── achievements.ts          # 実績リスト
│   ├── engine/
│   │   ├── merge.ts                 # マージエンジン（合成ロジック本体）
│   │   ├── battle.ts                # バトルエンジン（対戦計算）
│   │   ├── drop.ts                  # ドロップテーブル（確率計算）
│   │   ├── tournament.ts            # トーナメント進行管理
│   │   └── chimera.ts               # キメラステータス合算
│   ├── store/
│   │   └── gameStore.ts             # zustand store定義
│   ├── types/
│   │   └── index.ts                 # 全型定義
│   ├── utils/
│   │   ├── storage.ts               # AsyncStorageラッパー
│   │   ├── share.ts                 # シェア機能
│   │   ├── screenshot.ts            # スクリーンショット生成
│   │   └── analytics.ts             # イベント計測
│   ├── constants/
│   │   ├── colors.ts                # カラーパレット
│   │   ├── layout.ts                # レイアウト定数
│   │   └── config.ts                # ゲーム設定定数
│   └── assets/
│       ├── svg/
│       │   ├── heads/               # 頭SVG（15ファイル: head_dragon_1.svg ~ head_phoenix_5.svg）
│       │   ├── bodies/              # 胴SVG（15ファイル）
│       │   └── legs/                # 脚SVG（15ファイル）
│       ├── audio/
│       │   ├── bgm_title.mp3        # タイトルBGM
│       │   ├── bgm_main.mp3         # メインBGM
│       │   ├── bgm_arena.mp3        # 闘技場BGM
│       │   ├── se_merge.mp3         # マージ効果音
│       │   ├── se_merge_legendary.mp3 # Legendary マージ効果音
│       │   ├── se_equip.mp3         # 装備効果音
│       │   ├── se_battle_hit.mp3    # 攻撃ヒット
│       │   ├── se_battle_win.mp3    # 勝利ジングル
│       │   ├── se_battle_lose.mp3   # 敗北ジングル
│       │   ├── se_drop.mp3          # 部位入手
│       │   └── se_tap.mp3           # UI タップ
│       ├── images/
│       │   ├── logo.png             # タイトルロゴ
│       │   ├── arena_bg.png         # 闘技場背景
│       │   └── tutorial/            # チュートリアル画像（4枚）
│       └── fonts/
│           └── NotoSansJP-Bold.ttf  # 日本語フォント
├── app.json                          # Expo設定
├── package.json
├── tsconfig.json
├── babel.config.js
├── eas.json                          # EAS Build設定
├── DESIGN.md                         # この設計書
└── README.md
```

### 1.2 package.json

```json
{
  "name": "chimera-forge",
  "version": "1.0.0",
  "main": "expo-router/entry",
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "build:ios": "eas build --platform ios --profile production",
    "build:android": "eas build --platform android --profile production",
    "submit:ios": "eas submit --platform ios",
    "submit:android": "eas submit --platform android",
    "lint": "eslint . --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "expo": "~53.0.0",
    "expo-router": "~4.0.0",
    "expo-status-bar": "~2.0.0",
    "expo-haptics": "~14.0.0",
    "expo-av": "~15.0.0",
    "expo-notifications": "~0.30.0",
    "expo-sharing": "~13.0.0",
    "expo-file-system": "~18.0.0",
    "expo-font": "~13.0.0",
    "expo-splash-screen": "~0.29.0",
    "expo-constants": "~17.0.0",
    "expo-device": "~7.0.0",
    "react": "18.3.1",
    "react-native": "0.79.0",
    "react-native-reanimated": "~3.17.0",
    "react-native-gesture-handler": "~2.24.0",
    "react-native-svg": "~15.11.0",
    "react-native-view-shot": "~4.0.0",
    "react-native-google-mobile-ads": "~14.6.0",
    "react-native-purchases": "~8.3.0",
    "@react-native-async-storage/async-storage": "~2.1.0",
    "zustand": "~5.0.0",
    "react-native-safe-area-context": "~5.0.0",
    "react-native-screens": "~4.4.0",
    "lottie-react-native": "~7.1.0"
  },
  "devDependencies": {
    "@types/react": "~18.3.0",
    "typescript": "~5.7.0",
    "eslint": "~9.0.0",
    "@typescript-eslint/parser": "~8.0.0",
    "@typescript-eslint/eslint-plugin": "~8.0.0"
  }
}
```

### 1.3 app.json

```json
{
  "expo": {
    "name": "合成キメラ",
    "slug": "chimera-forge",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./src/assets/images/logo.png",
    "scheme": "chimera-forge",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./src/assets/images/logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#0D0D1A"
    },
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.pokkori.chimeraforge",
      "buildNumber": "1",
      "infoPlist": {
        "NSUserTrackingUsageDescription": "広告の最適化のためにトラッキングを使用します",
        "GADApplicationIdentifier": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
        "SKAdNetworkItems": [
          { "SKAdNetworkIdentifier": "cstr6suwn9.skadnetwork" }
        ]
      },
      "config": {
        "googleMobileAdsAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./src/assets/images/logo.png",
        "backgroundColor": "#0D0D1A"
      },
      "package": "com.pokkori.chimeraforge",
      "versionCode": 1,
      "permissions": ["INTERNET", "VIBRATE"]
    },
    "plugins": [
      "expo-router",
      "expo-font",
      "expo-haptics",
      "expo-notifications",
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~YYYYYYYYYY"
        }
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#0D0D1A",
          "image": "./src/assets/images/logo.png",
          "imageWidth": 200
        }
      ]
    ],
    "experiments": {
      "typedRoutes": true
    }
  }
}
```

### 1.4 eas.json

```json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "pokkori@example.com",
        "ascAppId": "XXXXXXXXXX",
        "appleTeamId": "XXXXXXXXXX"
      },
      "android": {
        "serviceAccountKeyPath": "./google-services.json",
        "track": "production"
      }
    }
  }
}
```

---

## 2. TypeScript型定義

```typescript
// src/types/index.ts

// ========================================
// 部位タイプ
// ========================================

/** 部位の種類（6種） */
export type PartType = 'head' | 'body' | 'arms' | 'legs' | 'wings' | 'tail';

/** 装備可能スロット（3箇所） — 頭=攻撃、胴=HP、脚=速度 */
export type SlotType = 'head' | 'body' | 'legs';

/** レア度（5段階） */
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

/** レア度の数値インデックス（マージ計算用） */
export const RARITY_INDEX: Record<Rarity, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  epic: 3,
  legendary: 4,
};

/** レア度の表示色 */
export const RARITY_COLOR: Record<Rarity, string> = {
  common: '#9E9E9E',     // グレー
  uncommon: '#4CAF50',   // グリーン
  rare: '#2196F3',       // ブルー
  epic: '#9C27B0',       // パープル
  legendary: '#FF9800',  // オレンジ（金縁エフェクト付き）
};

/** レア度の日本語名 */
export const RARITY_LABEL: Record<Rarity, string> = {
  common: 'コモン',
  uncommon: 'アンコモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンダリー',
};

// ========================================
// 部位系
// ========================================

/** 部位の種族（各タイプに3種族） */
export type PartSpecies = 'dragon' | 'phoenix' | 'kraken';

/** ステータス値 */
export interface Stats {
  /** 攻撃力 (0-999) */
  atk: number;
  /** 体力 (0-999) */
  hp: number;
  /** 速度 (0-999) */
  spd: number;
}

/** 部位定義（マスターデータ） */
export interface PartDef {
  /** 一意ID: "${type}_${species}_${rarityIndex}" 例: "head_dragon_0" */
  id: string;
  /** 部位タイプ */
  type: PartType;
  /** 種族 */
  species: PartSpecies;
  /** レア度 */
  rarity: Rarity;
  /** ステータス */
  stats: Stats;
  /** 表示用emoji */
  emoji: string;
  /** 部位名（日本語） */
  name: string;
  /** 説明文（フレーバーテキスト） */
  description: string;
  /** SVGパスのファイル名（拡張子なし） */
  svgKey: string;
}

/** 所持している部位インスタンス */
export interface PartInstance {
  /** UUID（インスタンス固有） */
  instanceId: string;
  /** マスターデータID（PartDef.id参照） */
  defId: string;
  /** 取得日時（ISO8601） */
  acquiredAt: string;
  /** ロック状態（誤売却防止） */
  locked: boolean;
}

// ========================================
// キメラ系
// ========================================

/** キメラ装備スロット */
export interface ChimeraSlots {
  /** 頭スロット（攻撃力ボーナス） — PartInstance.instanceId | null */
  head: string | null;
  /** 胴スロット（HPボーナス） — PartInstance.instanceId | null */
  body: string | null;
  /** 脚スロット（速度ボーナス） — PartInstance.instanceId | null */
  legs: string | null;
}

/** キメラ定義 */
export interface ChimeraDef {
  /** キメラ名（プレイヤー入力、最大10文字） */
  name: string;
  /** 装備スロット */
  slots: ChimeraSlots;
  /** 合算ステータス（装備変更時に再計算） */
  totalStats: Stats;
  /** 戦闘力（合算スコア = atk + hp + spd） */
  power: number;
}

// ========================================
// 対戦系
// ========================================

/** 対戦ログの1ターン */
export interface BattleTurn {
  /** ターン番号（1始まり） */
  turn: number;
  /** 攻撃側: 'player' | 'enemy' */
  attacker: 'player' | 'enemy';
  /** ダメージ量 */
  damage: number;
  /** 攻撃後の残りHP（攻撃された側） */
  remainingHp: number;
  /** クリティカルヒットか */
  isCritical: boolean;
}

/** 対戦結果 */
export interface BattleResult {
  /** 勝者: 'player' | 'enemy' | 'draw' */
  winner: 'player' | 'enemy' | 'draw';
  /** 対戦ログ */
  turns: BattleTurn[];
  /** プレイヤーキメラの最終HP */
  playerFinalHp: number;
  /** 敵キメラの最終HP */
  enemyFinalHp: number;
  /** 報酬部位（勝利時のみ） */
  rewardPart: PartInstance | null;
  /** 獲得コイン */
  coinsEarned: number;
  /** 対戦時刻（ISO8601） */
  timestamp: string;
}

/** CPU敵キメラ定義 */
export interface EnemyDef {
  /** 敵ID */
  id: string;
  /** 敵名 */
  name: string;
  /** 敵キメラのスロット（PartDef.id参照） */
  slotDefIds: { head: string; body: string; legs: string };
  /** 合算ステータス */
  totalStats: Stats;
  /** 表示用emoji（3つ連結） */
  emoji: string;
  /** 闘技場のランク（1-10） */
  arenaRank: number;
}

// ========================================
// トーナメント系
// ========================================

/** トーナメント状態 */
export type TournamentPhase = 'idle' | 'quarter' | 'semi' | 'final' | 'champion';

/** トーナメント対戦カード */
export interface TournamentMatch {
  /** 対戦ID */
  matchId: string;
  /** フェーズ */
  phase: TournamentPhase;
  /** 対戦相手（EnemyDef.id） */
  enemyId: string;
  /** 結果（未戦闘はnull） */
  result: BattleResult | null;
}

/** トーナメント全体 */
export interface Tournament {
  /** トーナメントID（日付ベース: "2026-03-20"） */
  id: string;
  /** 開始日時 */
  startedAt: string;
  /** 対戦カード（最大7戦: QF x4 → SF x2 → F x1） */
  matches: TournamentMatch[];
  /** 現在のフェーズ */
  currentPhase: TournamentPhase;
  /** 完了済みか */
  completed: boolean;
}

// ========================================
// ゲーム状態
// ========================================

/** 戦績 */
export interface BattleRecord {
  /** 総対戦数 */
  totalBattles: number;
  /** 勝利数 */
  wins: number;
  /** 敗北数 */
  losses: number;
  /** 引き分け数 */
  draws: number;
  /** 連勝記録 */
  maxWinStreak: number;
  /** 現在の連勝 */
  currentWinStreak: number;
  /** トーナメント優勝回数 */
  tournamentWins: number;
}

/** ゲーム全体の状態 */
export interface GameState {
  /** 所持部位一覧（最大100枠、IAP拡張可能） */
  inventory: PartInstance[];
  /** インベントリ上限 */
  inventoryLimit: number;
  /** 現在のキメラ構成 */
  chimera: ChimeraDef;
  /** 戦績 */
  record: BattleRecord;
  /** 所持コイン */
  coins: number;
  /** 図鑑（発見済みPartDef.id一覧） */
  codexDiscovered: string[];
  /** 現在のトーナメント */
  currentTournament: Tournament | null;
  /** 闘技場ランク（1-10、ランク上昇でドロップ品質向上） */
  arenaRank: number;
  /** 累計マージ回数 */
  totalMerges: number;
  /** 最終プレイ日時 */
  lastPlayedAt: string;
  /** チュートリアル完了フラグ */
  tutorialCompleted: boolean;
  /** 広告非表示購入済み */
  adFree: boolean;
  /** 実績解除済みID一覧 */
  achievementsUnlocked: string[];
  /** デイリーログインボーナス最終受取日 */
  lastDailyRewardDate: string | null;
  /** デイリーログイン連続日数 */
  dailyStreak: number;
}

// ========================================
// ストアアクション
// ========================================

/** zustand storeのアクション */
export interface GameActions {
  /** 部位をインベントリに追加 */
  addPart: (part: PartInstance) => void;
  /** 部位をインベントリから削除 */
  removePart: (instanceId: string) => void;
  /** 2つの部位をマージ（成功時: 元2つ削除+新1つ追加） */
  mergeParts: (instanceId1: string, instanceId2: string) => PartInstance | null;
  /** スロットに部位を装備 */
  equipPart: (slot: SlotType, instanceId: string) => void;
  /** スロットから部位を外す */
  unequipPart: (slot: SlotType) => void;
  /** キメラ名を変更 */
  renameChimera: (name: string) => void;
  /** 対戦実行 */
  executeBattle: (enemy: EnemyDef) => BattleResult;
  /** コイン増減 */
  addCoins: (amount: number) => void;
  /** 図鑑に登録 */
  discoverPart: (defId: string) => void;
  /** トーナメント開始 */
  startTournament: () => void;
  /** トーナメント次戦 */
  advanceTournament: (result: BattleResult) => void;
  /** デイリーボーナス受取 */
  claimDailyReward: () => PartInstance;
  /** ゲーム状態をAsyncStorageに保存 */
  saveGame: () => Promise<void>;
  /** ゲーム状態をAsyncStorageから復元 */
  loadGame: () => Promise<void>;
  /** ゲーム状態を初期化 */
  resetGame: () => void;
}

// ========================================
// UI系
// ========================================

/** ドラッグ状態 */
export interface DragState {
  /** ドラッグ中の部位instanceId | null */
  draggingPartId: string | null;
  /** ドラッグ開始位置 */
  startPosition: { x: number; y: number };
  /** 現在位置 */
  currentPosition: { x: number; y: number };
  /** ドロップ先候補（ハイライト用） */
  dropTarget: 'merge' | SlotType | null;
}

/** 画面遷移パラメータ */
export type RootStackParamList = {
  index: undefined;
  main: undefined;
  arena: { enemyId?: string };
  codex: undefined;
  shop: undefined;
};
```

---

## 3. 画面設計

### 3.1 タイトル画面 (`app/index.tsx`)

```
┌─────────────────────────┐
│                         │
│     [ロゴアニメーション]   │
│      🐉 合成キメラ 🐉     │
│      CHIMERA FORGE       │
│                         │
│   ┌───────────────────┐ │
│   │   ▶ はじめる       │ │  ← タップでメイン画面へ
│   └───────────────────┘ │
│   ┌───────────────────┐ │
│   │   📖 あそびかた     │ │  ← タップでチュートリアルモーダル
│   └───────────────────┘ │
│                         │
│   v1.0.0                │
│   🔊 / 🔇              │  ← BGM ON/OFF
└─────────────────────────┘
```

**動作仕様**:
- 起動時: スプラッシュ画面（0.5秒）→ ロゴがバウンスアニメーションで登場（`withSpring`、damping: 8）
- ロゴ: キメラのシルエットSVGが左右からパーツが飛んできて合体する演出（0.8秒）
- `はじめる`: AsyncStorageからセーブデータ読込。存在すれば直接メイン画面へ、なければチュートリアル開始
- `あそびかた`: 4ページのスライドチュートリアル（横スワイプ）
  - Page1: 「部位カードを集めよう」（部位カードが降ってくるアニメ）
  - Page2: 「同じ部位を合成！」（2枚重ねると光るアニメ）
  - Page3: 「キメラを設計」（3スロットにはめ込むアニメ）
  - Page4: 「闘技場で戦え！」（対戦シーンのアニメ）
- BGMトグル: タイトルBGM `bgm_title.mp3` ループ再生。トグルはAsyncStorageに永続化

### 3.2 メイン画面 (`app/main.tsx`)

```
┌─────────────────────────┐
│ 💰1,250  ⚔️Rank3  📊42W │  ← ヘッダー: コイン・ランク・勝利数
├─────────────────────────┤
│  【キメラプレビュー】      │
│  ┌─────────────────────┐│
│  │    🐲                ││  ← ChimeraPreview: SVG合成表示
│  │  [頭]+[胴]+[脚]      ││    装備3部位を動的合成描画
│  │  ATK:120 HP:200 SPD:80││   ステータスバー表示
│  │  ⚡Power: 400         ││
│  │  名前: "ドラゴニクス"   ││  ← タップで名前変更モーダル
│  └─────────────────────┘│
├─────────────────────────┤
│  【装備スロット (3枠)】    │
│  ┌─────┐┌─────┐┌─────┐ │
│  │🗡HEAD ││🛡BODY││🦶LEGS│ │  ← PartSlot: ドロップ受容
│  │dragon││phoe ││krak │ │    装備中はパーツ表示
│  │ATK+50││HP+80││SPD+40│ │    長押しで外す
│  └─────┘└─────┘└─────┘ │
├─────────────────────────┤
│  【マージ台】              │
│  ┌───────────┐           │
│  │  ⚗️ ここに2つ │         │  ← MergeStation: 2つドロップで合成
│  │  ドロップ！   │         │    同種+同レアのみ受付
│  └───────────┘           │
├─────────────────────────┤
│  【インベントリ】 12/50    │  ← 所持数/上限
│  ┌──┐┌──┐┌──┐┌──┐┌──┐  │
│  │🐉││🦅││🐙││🐲││🔥│  │  ← PartCard: ドラッグ可能
│  │C1 ││C2 ││R1 ││U3 ││E1│  │    レア度で枠色変化
│  └──┘└──┘└──┘└──┘└──┘  │
│  ← スクロール →           │  ← FlatList横スクロール
├─────────────────────────┤
│  [⚔️闘技場] [📖図鑑] [🛒ショップ]│ ← 下部ナビゲーション
└─────────────────────────┘
```

**動作仕様**:

#### キメラプレビュー
- 装備スロットに部位がセットされるたびにリアルタイム更新
- SVGパーツを動的合成（詳細は10章）
- キメラが待機アニメーション（上下にゆっくり浮遊: `withRepeat(withTiming(translateY, {duration:2000}), -1, true)`）
- 戦闘力 `power = atk + hp + spd`
- 全スロット空の場合: シルエット表示 + 「部位を装備しよう！」テキスト

#### 装備スロット (PartSlot)
- 各スロットは特定の部位タイプのみ受付:
  - HEAD: `head`, `wings`（頭系） → 主に攻撃力ボーナス
  - BODY: `body`, `arms`（胴系） → 主にHPボーナス
  - LEGS: `legs`, `tail`（脚系） → 主に速度ボーナス
- ドロップ受容判定: スロット中心から半径60dp以内
- 装備時: `se_equip.mp3` + スロット枠が0.1秒拡大→戻るアニメ + ハプティクス（medium）
- 長押し（500ms）: 装備解除確認なしで即外す + ハプティクス（light）

#### マージ台 (MergeStation)
- 2つの部位をドロップすると合成判定
- 合成条件: `part1.type === part2.type && part1.rarity === part2.rarity`
- 合成可能: マージエフェクト再生（光+パーティクル 0.8秒）→ 新部位入手
- 合成不可: 台が赤く光る（0.3秒）+ バイブレーション（error）+ 「同じ種類・レア度の部位が必要！」トースト
- Legendary同士のマージ: **不可**（最高レア度）→ 特別エフェクト + 「これ以上は進化できない」メッセージ

#### インベントリ (PartInventory)
- FlatList横スクロール、カード幅72dp、間隔8dp
- ソート: デフォルトはレア度降順 → タイプ順 → 取得日時降順
- フィルター: 上部にPartTypeタブ（全て/頭/胴/腕/脚/翼/尾）
- 各カードに: emoji + レア度枠色 + タイプアイコン小
- タップ: 詳細モーダル（ステータス・説明文・ロック切替・売却ボタン）
- ドラッグ開始: カードが1.1倍に拡大 + 影エフェクト + ハプティクス（selection）
- 上限到達時: 「インベントリがいっぱいです！合成か売却でスペースを空けましょう」

#### ドラッグ&ドロップ制御 (useDragDrop)
```typescript
// useDragDrop.ts の疑似コード
const pan = useMemo(() =>
  Gesture.Pan()
    .onStart((e) => {
      // ドラッグ対象の部位を特定（タッチ座標からFlatListアイテムを判定）
      // SharedValue: dragging.value = { instanceId, startX, startY }
      // ハプティクス: selectionAsync()
    })
    .onUpdate((e) => {
      // translateX.value = e.translationX
      // translateY.value = e.translationY
      // ドロップ先候補ハイライト判定（各スロット・マージ台の矩形との衝突判定）
    })
    .onEnd((e) => {
      // ドロップ先確定
      // → スロット上: equipPart()
      // → マージ台上: mergeParts()（すでに1つ乗っている場合）
      // → どこでもない: withSpring で元位置に戻る
    }),
  []
);
```

### 3.3 闘技場画面 (`app/arena.tsx`)

```
┌─────────────────────────┐
│ ← 戻る    ⚔️ 闘技場      │
├─────────────────────────┤
│                         │
│  【対戦相手選択】          │  ← arenaRankに応じた敵リスト
│  ┌─────────────────────┐│
│  │ 🦁 ライオニクス        ││
│  │ ATK:80 HP:150 SPD:60 ││  ← EnemyDef表示
│  │ ⚡Power: 290          ││
│  │ [⚔️ 挑戦する]         ││  ← タップで対戦開始
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 🐺 ウルフガルド        ││
│  │ ATK:100 HP:120 SPD:90││
│  │ ⚡Power: 310          ││
│  │ [⚔️ 挑戦する]         ││
│  └─────────────────────┘│
│  ... (ランク内3体表示)     │
│                         │
│  ┌─────────────────────┐│
│  │ 🏆 トーナメント参加    ││  ← 1日1回参加可能
│  │ (次回参加可能まで 4:32) ││
│  └─────────────────────┘│
│                         │
│ [バナー広告 320x50]       │  ← AdMob Banner
└─────────────────────────┘

--- 対戦開始後 ---

┌─────────────────────────┐
│        ⚔️ BATTLE!        │
├─────────────────────────┤
│                         │
│  [自キメラSVG]  VS  [敵SVG]│ ← 左右に配置、idle アニメ
│  "ドラゴニクス"    "ライオニクス"│
│                         │
│  ███████░░░ HP:150/200   │ ← 自分HPバー（緑→黄→赤）
│  █████░░░░ HP:100/150    │ ← 敵HPバー
│                         │
│  --- ターンログ ---       │
│  Turn1: 🗡ドラゴニクス → 45dmg │ ← ターンごとにスクロール表示
│  Turn2: 🗡ライオニクス → 30dmg │    クリティカルは赤太字+画面振動
│  Turn3: 🗡ドラゴニクス → 52dmg💥│
│  ...                     │
│                         │
│  ===== 3秒で自動進行 ===== │ ← 各ターン0.5秒間隔で自動再生
└─────────────────────────┘

--- 結果表示 ---

┌─────────────────────────┐
│                         │
│     🎉 YOU WIN! 🎉       │  ← 勝利: 紙吹雪エフェクト
│     😢 YOU LOSE...       │  ← 敗北: 画面暗転
│                         │
│  報酬:                   │
│  ┌─────────────────────┐│
│  │ 🐉 ドラゴンの翼 (Rare) ││  ← 獲得部位（レア枠で光る）
│  │ 💰 +150 コイン        ││
│  └─────────────────────┘│
│                         │
│  [📺 広告で報酬2倍]       │  ← リワード広告（任意）
│  [📤 結果をシェア]        │  ← シェアボタン
│  [🔙 闘技場に戻る]        │
│                         │
└─────────────────────────┘
```

**動作仕様**:

#### 対戦相手選択
- `arenaRank`（1-10）に応じた3体の敵を表示
- 各敵は固定データ（`enemies.ts`から読込）
- プレイヤーの`power`より-50〜+100の範囲の敵を自動選出
- ランク上昇条件: そのランクの全3体に勝利

#### 対戦アニメーション（BattleAnimation）
- 開始: 「BATTLE!」テキストが画面中央にズームイン → 0.5秒で消失
- ターン進行: 0.5秒間隔で自動進行（全ターン合計最大3秒 = 最大6ターン）
- 攻撃演出:
  - 攻撃側キメラが前方に0.1秒突進（translateX +/- 30）→ 戻る
  - 被攻撃側が0.05秒赤フラッシュ + 微振動
  - ダメージ数字が被攻撃側から浮き上がって消える（translateY -40, opacity 1→0, duration 0.6秒）
  - クリティカル: 画面全体が0.05秒白フラッシュ + 「💥CRITICAL!」テキスト + ハプティクス（heavy）
- HPバー: ダメージに応じてアニメーション減少（`withTiming`, duration: 0.3秒）
  - 100-50%: 緑 `#4CAF50`
  - 50-20%: 黄 `#FFC107`
  - 20-0%: 赤 `#F44336`
- 勝敗演出:
  - 勝利: `se_battle_win.mp3` + 紙吹雪パーティクル（Lottie, 2秒）+ ハプティクス（success）
  - 敗北: `se_battle_lose.mp3` + 画面暗転（opacity 0.7黒オーバーレイ）+ ハプティクス（error）
  - 引き分け: 両方グレーアウト + 「DRAW」テキスト

#### リワード広告
- 勝利時のみ「広告で報酬2倍」ボタン表示
- `react-native-google-mobile-ads` の `RewardedAd`
- 視聴完了: 報酬部位のレアリティが1段階上昇（ただしLegendary上限）、コイン2倍
- 視聴途中離脱: 通常報酬のまま

### 3.4 部位図鑑画面 (`app/codex.tsx`)

```
┌─────────────────────────┐
│ ← 戻る    📖 部位図鑑     │
├─────────────────────────┤
│ 進捗: 28/45 (62%)        │  ← プログレスバー
│ ████████████░░░░░░░░     │
├─────────────────────────┤
│ [全て][🗡頭][🛡胴][🦶脚]   │  ← フィルタータブ
├─────────────────────────┤
│ --- 🐉 ドラゴン系 ---     │  ← 種族セクション
│ ┌──┐┌──┐┌──┐┌──┐┌──┐  │
│ │🐉││🐉││🐉││❓││❓│  │  ← 発見済み=カラー、未発見=シルエット
│ │C ││U ││R ││E ││L │  │    レア度表記
│ └──┘└──┘└──┘└──┘└──┘  │
│ --- 🦅 フェニックス系 --- │
│ ┌──┐┌──┐┌──┐┌──┐┌──┐  │
│ │🦅││🦅││❓││❓││❓│  │
│ │C ││U ││R ││E ││L │  │
│ └──┘└──┘└──┘└──┘└──┘  │
│ --- 🐙 クラーケン系 ---   │
│ ...                     │
├─────────────────────────┤
│ タップで詳細:             │
│ ┌─────────────────────┐ │
│ │ 🐉 ドラゴンの頭 (Rare)  │ │
│ │ ATK:45 HP:10 SPD:5    │ │
│ │ "灼熱の息を吐く古竜の頭部"│ │
│ │ 取得日: 2026-03-20     │ │
│ └─────────────────────┘ │
└─────────────────────────┘
```

**動作仕様**:
- グリッド表示: 5列 x 3行/種族 x 3種族 = 45マス
- 発見済み: フルカラーemoji + レア度枠色
- 未発見: グレースケールシルエット + 「？」
- タップ: 下部に詳細カードがスライドイン（`withSpring`）
- コンプリートボーナス:
  - 1種族コンプ（15部位）: 100コイン + 称号
  - 全コンプ（45部位）: 500コイン + 限定称号「キメラマスター」

### 3.5 ショップ画面 (`app/shop.tsx`)

```
┌─────────────────────────┐
│ ← 戻る    🛒 ショップ     │
├─────────────────────────┤
│ 💰 1,250 コイン          │
├─────────────────────────┤
│ --- 💎 プレミアム ---     │
│ ┌─────────────────────┐ │
│ │ 🚫広告 広告除去パック    │ │  ← ¥480 (IAP)
│ │ バナー・インターステ削除  │ │
│ │        [¥480で購入]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 📦 スターターパック     │ │  ← ¥980 (IAP)
│ │ Rare部位3個+1000コイン  │ │
│ │        [¥980で購入]    │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🎒 インベントリ拡張    │ │  ← ¥320 (IAP)
│ │ +50枠 (50→100)        │ │
│ │        [¥320で購入]    │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ --- 💰 コインで購入 ---   │
│ ┌─────────────────────┐ │
│ │ 🎲 ランダム部位ガチャ   │ │  ← 100コイン
│ │ Common70%/Uncommon25%  │ │
│ │ /Rare5%              │ │
│ │      [💰100 引く]      │ │
│ └─────────────────────┘ │
│ ┌─────────────────────┐ │
│ │ 🎲 プレミアムガチャ     │ │  ← 500コイン
│ │ Uncommon40%/Rare35%   │ │
│ │ /Epic20%/Legendary5%  │ │
│ │      [💰500 引く]      │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ --- 📺 無料 ---          │
│ ┌─────────────────────┐ │
│ │ 📺 広告で部位ゲット     │ │  ← リワード広告
│ │ (1日3回まで)           │ │
│ │   [📺 広告を見る] 残り2回│ │
│ └─────────────────────┘ │
│ [バナー広告 320x50]       │
└─────────────────────────┘
```

**動作仕様**:
- IAP: `react-native-purchases` (RevenueCat) 経由
- コインガチャ: 即座に結果表示（カード出現演出 0.5秒）
- ガチャ演出: カードが裏面から表にフリップ（`rotateY` 0→180deg, 0.5秒）+ レア度に応じた光エフェクト
- Legendary排出時: 画面全体が金色フラッシュ + 特別SE + 3秒の演出

---

## 4. ゲームロジック

### 4.1 マージアルゴリズム

```typescript
// src/engine/merge.ts

import { PartInstance, PartDef, Rarity, RARITY_INDEX, PartSpecies } from '../types';
import { PARTS_DATA } from '../data/parts';
import { generateUUID } from '../utils/uuid';

/**
 * マージ条件判定
 * @returns true: マージ可能
 */
export function canMerge(part1: PartDef, part2: PartDef): boolean {
  // 条件1: 同じ部位タイプ
  if (part1.type !== part2.type) return false;
  // 条件2: 同じレア度
  if (part1.rarity !== part2.rarity) return false;
  // 条件3: Legendaryは最高なのでマージ不可
  if (part1.rarity === 'legendary') return false;
  // 条件4: 種族は問わない（異種族でもマージ可能）
  return true;
}

/**
 * マージ実行 → 新しい部位を生成
 *
 * ルール:
 * - 同タイプ+同レア → 1段階上のレアに進化
 * - 種族の決定: 確率テーブル（後述）
 * - ステータス: 新レア度の基礎値 + ボーナス（元2体の種族が同じなら+10%）
 */
export function executeMerge(
  instance1: PartInstance,
  instance2: PartInstance,
  allParts: PartDef[]
): PartInstance | null {
  const def1 = allParts.find(p => p.id === instance1.defId);
  const def2 = allParts.find(p => p.id === instance2.defId);
  if (!def1 || !def2) return null;
  if (!canMerge(def1, def2)) return null;

  const nextRarity = getNextRarity(def1.rarity);
  if (!nextRarity) return null; // legendary は上がない

  // 種族決定（確率テーブル）
  const resultSpecies = determineSpecies(def1.species, def2.species);

  // 新部位のDefIdを構築
  const newDefId = `${def1.type}_${resultSpecies}_${RARITY_INDEX[nextRarity]}`;
  const newDef = allParts.find(p => p.id === newDefId);
  if (!newDef) return null;

  // 同種族ボーナス
  const sameSpeciesBonus = def1.species === def2.species ? 1.1 : 1.0;

  // 注: ステータスはマスターデータのまま（ボーナスは将来の強化枠）
  const newInstance: PartInstance = {
    instanceId: generateUUID(),
    defId: newDefId,
    acquiredAt: new Date().toISOString(),
    locked: false,
  };

  return newInstance;
}

/** レア度を1段階上げる */
function getNextRarity(current: Rarity): Rarity | null {
  const order: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
  const idx = order.indexOf(current);
  if (idx >= order.length - 1) return null;
  return order[idx + 1];
}

/**
 * 種族決定テーブル
 *
 * 同種族 → 100% その種族
 * 異種族 → 各50%（ランダム）
 *
 * 例: dragon + phoenix → 50% dragon / 50% phoenix
 */
function determineSpecies(s1: PartSpecies, s2: PartSpecies): PartSpecies {
  if (s1 === s2) return s1;
  return Math.random() < 0.5 ? s1 : s2;
}
```

### 4.2 対戦ステータス計算式

```typescript
// src/engine/battle.ts

import { ChimeraDef, EnemyDef, BattleResult, BattleTurn, Stats } from '../types';

/** スロットボーナス倍率 */
const SLOT_BONUS: Record<string, keyof Stats> = {
  head: 'atk',  // 頭スロットは攻撃力1.5倍
  body: 'hp',   // 胴スロットはHP1.5倍
  legs: 'spd',  // 脚スロットは速度1.5倍
};
const SLOT_BONUS_MULTIPLIER = 1.5;

/**
 * キメラの最終ステータスを計算
 *
 * 計算式:
 *   各スロットの部位ステータスを合算
 *   → スロットボーナス: 頭スロットのATK * 1.5, 胴スロットのHP * 1.5, 脚スロットのSPD * 1.5
 *   → 小数切り捨て
 */
export function calculateChimeraStats(
  headStats: Stats | null,
  bodyStats: Stats | null,
  legsStats: Stats | null
): Stats {
  let atk = 0, hp = 0, spd = 0;

  if (headStats) {
    atk += Math.floor(headStats.atk * SLOT_BONUS_MULTIPLIER); // 頭ATKボーナス
    hp += headStats.hp;
    spd += headStats.spd;
  }
  if (bodyStats) {
    atk += bodyStats.atk;
    hp += Math.floor(bodyStats.hp * SLOT_BONUS_MULTIPLIER);    // 胴HPボーナス
    spd += bodyStats.spd;
  }
  if (legsStats) {
    atk += legsStats.atk;
    hp += legsStats.hp;
    spd += Math.floor(legsStats.spd * SLOT_BONUS_MULTIPLIER);  // 脚SPDボーナス
  }

  return { atk, hp, spd };
}

/**
 * 対戦実行
 *
 * ルール:
 * 1. 先攻決定: SPDが高い方が先攻。同値ならランダム
 * 2. ターン制: 交互に攻撃（最大6ターン、3秒想定で0.5秒/ターン）
 * 3. ダメージ計算:
 *    baseDamage = attacker.atk * (0.8 + Math.random() * 0.4)
 *    → つまりATKの80%〜120%のランダムダメージ
 * 4. クリティカル: 10%の確率でダメージ1.5倍
 * 5. 勝敗: HP <= 0で敗北。6ターン後に両者生存なら残りHP割合の高い方が勝利
 * 6. 引き分け: 残りHP割合が同じ（±5%以内）
 */
export function executeBattle(
  player: Stats,
  enemy: Stats
): BattleResult {
  let playerHp = player.hp;
  let enemyHp = enemy.hp;
  const turns: BattleTurn[] = [];

  // 先攻決定
  let playerFirst: boolean;
  if (player.spd !== enemy.spd) {
    playerFirst = player.spd > enemy.spd;
  } else {
    playerFirst = Math.random() < 0.5;
  }

  const MAX_TURNS = 6;

  for (let i = 0; i < MAX_TURNS; i++) {
    const isPlayerTurn = (i % 2 === 0) === playerFirst;

    if (isPlayerTurn) {
      // プレイヤー攻撃
      const { damage, isCritical } = calculateDamage(player.atk);
      enemyHp = Math.max(0, enemyHp - damage);
      turns.push({
        turn: i + 1,
        attacker: 'player',
        damage,
        remainingHp: enemyHp,
        isCritical,
      });
      if (enemyHp <= 0) break;
    } else {
      // 敵攻撃
      const { damage, isCritical } = calculateDamage(enemy.atk);
      playerHp = Math.max(0, playerHp - damage);
      turns.push({
        turn: i + 1,
        attacker: 'enemy',
        damage,
        remainingHp: playerHp,
        isCritical,
      });
      if (playerHp <= 0) break;
    }
  }

  // 勝敗判定
  let winner: 'player' | 'enemy' | 'draw';
  if (enemyHp <= 0 && playerHp > 0) {
    winner = 'player';
  } else if (playerHp <= 0 && enemyHp > 0) {
    winner = 'enemy';
  } else if (playerHp <= 0 && enemyHp <= 0) {
    winner = 'draw';
  } else {
    // 両者生存: 残りHP割合で判定
    const playerRatio = playerHp / player.hp;
    const enemyRatio = enemyHp / enemy.hp;
    if (Math.abs(playerRatio - enemyRatio) < 0.05) {
      winner = 'draw';
    } else {
      winner = playerRatio > enemyRatio ? 'player' : 'enemy';
    }
  }

  return {
    winner,
    turns,
    playerFinalHp: playerHp,
    enemyFinalHp: enemyHp,
    rewardPart: null, // 呼び出し元で設定
    coinsEarned: 0,   // 呼び出し元で設定
    timestamp: new Date().toISOString(),
  };
}

function calculateDamage(atk: number): { damage: number; isCritical: boolean } {
  const baseMultiplier = 0.8 + Math.random() * 0.4; // 0.8 ~ 1.2
  const isCritical = Math.random() < 0.10; // 10%
  const critMultiplier = isCritical ? 1.5 : 1.0;
  const damage = Math.floor(atk * baseMultiplier * critMultiplier);
  return { damage, isCritical };
}
```

### 4.3 部位ドロップテーブル

```typescript
// src/engine/drop.ts

import { Rarity, PartType, PartSpecies, RARITY_INDEX } from '../types';
import { PARTS_DATA } from '../data/parts';
import { generateUUID } from '../utils/uuid';

/**
 * 勝利報酬のドロップテーブル
 *
 * arenaRank別のレア度出現確率:
 *
 * | arenaRank | Common | Uncommon | Rare  | Epic  | Legendary |
 * |-----------|--------|----------|-------|-------|-----------|
 * | 1-2       | 60%    | 30%      | 8%    | 1.8%  | 0.2%      |
 * | 3-4       | 45%    | 35%      | 15%   | 4%    | 1%        |
 * | 5-6       | 30%    | 35%      | 25%   | 8%    | 2%        |
 * | 7-8       | 15%    | 30%      | 35%   | 15%   | 5%        |
 * | 9-10      | 5%     | 20%      | 40%   | 25%   | 10%       |
 */

const DROP_TABLE: Record<number, number[]> = {
  // [common, uncommon, rare, epic, legendary] 累積確率
  1:  [0.60, 0.90, 0.98, 0.998, 1.0],
  2:  [0.60, 0.90, 0.98, 0.998, 1.0],
  3:  [0.45, 0.80, 0.95, 0.99,  1.0],
  4:  [0.45, 0.80, 0.95, 0.99,  1.0],
  5:  [0.30, 0.65, 0.90, 0.98,  1.0],
  6:  [0.30, 0.65, 0.90, 0.98,  1.0],
  7:  [0.15, 0.45, 0.80, 0.95,  1.0],
  8:  [0.15, 0.45, 0.80, 0.95,  1.0],
  9:  [0.05, 0.25, 0.65, 0.90,  1.0],
  10: [0.05, 0.25, 0.65, 0.90,  1.0],
};

const RARITIES: Rarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const PART_TYPES: PartType[] = ['head', 'body', 'arms', 'legs', 'wings', 'tail'];
const SPECIES: PartSpecies[] = ['dragon', 'phoenix', 'kraken'];

/**
 * 報酬部位を1つ生成
 */
export function generateRewardPart(arenaRank: number): { defId: string; rarity: Rarity } {
  const table = DROP_TABLE[Math.min(Math.max(arenaRank, 1), 10)];
  const roll = Math.random();

  let rarity: Rarity = 'common';
  for (let i = 0; i < table.length; i++) {
    if (roll < table[i]) {
      rarity = RARITIES[i];
      break;
    }
  }

  // タイプはランダム
  const type = PART_TYPES[Math.floor(Math.random() * PART_TYPES.length)];
  // 種族はランダム
  const species = SPECIES[Math.floor(Math.random() * SPECIES.length)];
  // DefIdを構築（装備不可部位(arms/wings/tail)もドロップする→マージ素材として価値あり）
  const defId = `${type}_${species}_${RARITY_INDEX[rarity]}`;

  return { defId, rarity };
}

/**
 * コイン報酬計算
 * 基礎: 50 + arenaRank * 20
 * 連勝ボーナス: +10% per streak (最大+50%)
 */
export function calculateCoinReward(arenaRank: number, winStreak: number): number {
  const base = 50 + arenaRank * 20;
  const streakBonus = Math.min(winStreak * 0.1, 0.5);
  return Math.floor(base * (1 + streakBonus));
}
```

### 4.4 トーナメント進行ロジック

```typescript
// src/engine/tournament.ts

import { Tournament, TournamentMatch, TournamentPhase, EnemyDef } from '../types';
import { ENEMY_DATA } from '../data/enemies';

/**
 * トーナメント構造:
 * - 8体参加（プレイヤー+CPU 7体）
 * - 準々決勝(QF): 4試合 → 準決勝(SF): 2試合 → 決勝(F): 1試合
 * - プレイヤーの対戦は QF 1戦 → SF 1戦 → F 1戦 = 最大3戦
 * - 1日1回参加可能（リセットは日本時間0:00）
 *
 * 対戦相手選出:
 * - プレイヤーのpowerの ±30% 範囲内でランダム選出
 * - ラウンドが進むごとに+10%強い相手が出現
 */

export function createTournament(
  playerPower: number,
  arenaRank: number
): Tournament {
  const today = new Date().toISOString().split('T')[0]; // "2026-03-20"

  // 対戦相手を3体選出（QF, SF, F）
  const qfEnemy = selectEnemy(playerPower * 0.9, playerPower * 1.1, arenaRank);
  const sfEnemy = selectEnemy(playerPower * 1.0, playerPower * 1.2, arenaRank);
  const fEnemy  = selectEnemy(playerPower * 1.1, playerPower * 1.3, arenaRank);

  const matches: TournamentMatch[] = [
    { matchId: `${today}_qf`, phase: 'quarter', enemyId: qfEnemy.id, result: null },
    { matchId: `${today}_sf`, phase: 'semi',    enemyId: sfEnemy.id, result: null },
    { matchId: `${today}_f`,  phase: 'final',   enemyId: fEnemy.id,  result: null },
  ];

  return {
    id: today,
    startedAt: new Date().toISOString(),
    matches,
    currentPhase: 'quarter',
    completed: false,
  };
}

function selectEnemy(minPower: number, maxPower: number, arenaRank: number): EnemyDef {
  const candidates = ENEMY_DATA.filter(e => {
    const power = e.totalStats.atk + e.totalStats.hp + e.totalStats.spd;
    return power >= minPower && power <= maxPower && e.arenaRank <= arenaRank + 2;
  });

  if (candidates.length === 0) {
    // フォールバック: ランク内の全敵からランダム
    const fallback = ENEMY_DATA.filter(e => e.arenaRank <= arenaRank + 2);
    return fallback[Math.floor(Math.random() * fallback.length)];
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}

/**
 * トーナメント進行
 * - 勝利 → 次ラウンドへ
 * - 敗北 → トーナメント終了（敗退報酬あり）
 *
 * 報酬:
 * | ラウンド | 勝利報酬コイン | 部位ドロップ保証レア度 |
 * |---------|-------------|-------------------|
 * | QF敗退   | 100         | Common保証         |
 * | SF敗退   | 200         | Uncommon保証       |
 * | F敗退    | 300         | Rare保証           |
 * | 優勝     | 500         | Epic保証(10% Legendary)|
 */
export const TOURNAMENT_REWARDS: Record<string, { coins: number; minRarity: number }> = {
  'quarter_lose': { coins: 100, minRarity: 0 },  // Common
  'semi_lose':    { coins: 200, minRarity: 1 },  // Uncommon
  'final_lose':   { coins: 300, minRarity: 2 },  // Rare
  'champion':     { coins: 500, minRarity: 3 },  // Epic (10% Legendary)
};
```

---

## 5. 部位データ（全45部位）

```typescript
// src/data/parts.ts

import { PartDef } from '../types';

/**
 * 全45部位マスターデータ
 *
 * ID命名規則: "{type}_{species}_{rarityIndex}"
 * - type: head / body / legs（装備可能3種）
 * - species: dragon / phoenix / kraken
 * - rarityIndex: 0=Common, 1=Uncommon, 2=Rare, 3=Epic, 4=Legendary
 *
 * ステータス設計方針:
 * - 頭(head): ATK特化（ATK高、HP・SPD低）
 * - 胴(body): HP特化（HP高、ATK・SPD低）
 * - 脚(legs): SPD特化（SPD高、ATK・HP低）
 * - 種族特性:
 *   - dragon: ATK寄り（全体的に攻撃的）
 *   - phoenix: SPD寄り（全体的に素早い）
 *   - kraken: HP寄り（全体的に耐久的）
 * - レア度倍率: C=1.0, U=1.8, R=3.0, E=5.0, L=8.0
 */

export const PARTS_DATA: PartDef[] = [
  // ================================================================
  // 🐉 ドラゴン系・頭 (HEAD x DRAGON) — ATK特化 + ドラゴンATKボーナス
  // ================================================================
  {
    id: 'head_dragon_0',
    type: 'head',
    species: 'dragon',
    rarity: 'common',
    stats: { atk: 15, hp: 5, spd: 3 },
    emoji: '🐲',
    name: 'ドラゴンの幼頭',
    description: 'まだ角も生えていない幼いドラゴンの頭。しかし瞳には炎が宿る。',
    svgKey: 'head_dragon_1',
  },
  {
    id: 'head_dragon_1',
    type: 'head',
    species: 'dragon',
    rarity: 'uncommon',
    stats: { atk: 27, hp: 9, spd: 5 },
    emoji: '🐲',
    name: 'ドラゴンの角頭',
    description: '小さな角が2本生えたドラゴンの頭。火の息を少し吐ける。',
    svgKey: 'head_dragon_2',
  },
  {
    id: 'head_dragon_2',
    type: 'head',
    species: 'dragon',
    rarity: 'rare',
    stats: { atk: 45, hp: 15, spd: 8 },
    emoji: '🐉',
    name: 'ドラゴンの烈頭',
    description: '鋭い角と牙を持つ成熟したドラゴンの頭。灼熱のブレスを放つ。',
    svgKey: 'head_dragon_3',
  },
  {
    id: 'head_dragon_3',
    type: 'head',
    species: 'dragon',
    rarity: 'epic',
    stats: { atk: 75, hp: 25, spd: 13 },
    emoji: '🐉',
    name: 'ドラゴンの覇頭',
    description: '黄金の角冠を戴く古竜の頭。その咆哮は山を震わせる。',
    svgKey: 'head_dragon_4',
  },
  {
    id: 'head_dragon_4',
    type: 'head',
    species: 'dragon',
    rarity: 'legendary',
    stats: { atk: 120, hp: 40, spd: 20 },
    emoji: '🐉',
    name: '始祖竜バハムートの頭',
    description: '万物を灰燼に帰す始祖竜の頭。視線だけで鉄を溶かす。',
    svgKey: 'head_dragon_5',
  },

  // ================================================================
  // 🦅 フェニックス系・頭 (HEAD x PHOENIX) — ATK特化 + フェニックスSPDボーナス
  // ================================================================
  {
    id: 'head_phoenix_0',
    type: 'head',
    species: 'phoenix',
    rarity: 'common',
    stats: { atk: 12, hp: 3, spd: 8 },
    emoji: '🐦',
    name: 'フェニックスの雛頭',
    description: 'まだ羽毛もまばらな火の鳥の雛。小さなくちばしが光る。',
    svgKey: 'head_phoenix_1',
  },
  {
    id: 'head_phoenix_1',
    type: 'head',
    species: 'phoenix',
    rarity: 'uncommon',
    stats: { atk: 22, hp: 5, spd: 14 },
    emoji: '🦅',
    name: 'フェニックスの炎頭',
    description: '頭頂の羽が燃え始めた若鳥。鋭い目が獲物を見逃さない。',
    svgKey: 'head_phoenix_2',
  },
  {
    id: 'head_phoenix_2',
    type: 'head',
    species: 'phoenix',
    rarity: 'rare',
    stats: { atk: 38, hp: 8, spd: 22 },
    emoji: '🦅',
    name: 'フェニックスの烈嘴',
    description: '炎を纏うくちばしで敵を貫く。翼冠が威厳を放つ。',
    svgKey: 'head_phoenix_3',
  },
  {
    id: 'head_phoenix_3',
    type: 'head',
    species: 'phoenix',
    rarity: 'epic',
    stats: { atk: 63, hp: 13, spd: 37 },
    emoji: '🔥',
    name: 'フェニックスの焔冠',
    description: '不死鳥の炎冠。死んでも灰から蘇る再生の力を秘める。',
    svgKey: 'head_phoenix_4',
  },
  {
    id: 'head_phoenix_4',
    type: 'head',
    species: 'phoenix',
    rarity: 'legendary',
    stats: { atk: 100, hp: 20, spd: 60 },
    emoji: '🔥',
    name: '永劫鳥スザクの頭',
    description: '太陽すら焼き尽くす永劫の火鳥。羽ばたきが世界を照らす。',
    svgKey: 'head_phoenix_5',
  },

  // ================================================================
  // 🐙 クラーケン系・頭 (HEAD x KRAKEN) — ATK特化 + クラーケンHPボーナス
  // ================================================================
  {
    id: 'head_kraken_0',
    type: 'head',
    species: 'kraken',
    rarity: 'common',
    stats: { atk: 10, hp: 10, spd: 3 },
    emoji: '🐙',
    name: 'クラーケンの幼頭',
    description: '深海に棲む小さなタコの頭。墨を吐いて逃げることしかできない。',
    svgKey: 'head_kraken_1',
  },
  {
    id: 'head_kraken_1',
    type: 'head',
    species: 'kraken',
    rarity: 'uncommon',
    stats: { atk: 18, hp: 18, spd: 5 },
    emoji: '🐙',
    name: 'クラーケンの吸頭',
    description: '吸盤が発達した深海獣の頭。獲物を逃さない。',
    svgKey: 'head_kraken_2',
  },
  {
    id: 'head_kraken_2',
    type: 'head',
    species: 'kraken',
    rarity: 'rare',
    stats: { atk: 30, hp: 30, spd: 8 },
    emoji: '🦑',
    name: 'クラーケンの裂顎',
    description: '巨大なくちばしで船の竜骨すら噛み砕く。深淵の恐怖。',
    svgKey: 'head_kraken_3',
  },
  {
    id: 'head_kraken_3',
    type: 'head',
    species: 'kraken',
    rarity: 'epic',
    stats: { atk: 50, hp: 50, spd: 13 },
    emoji: '🦑',
    name: 'クラーケンの深淵頭',
    description: '海溝の底で眠る古代海獣の頭。その目は闇を見通す。',
    svgKey: 'head_kraken_4',
  },
  {
    id: 'head_kraken_4',
    type: 'head',
    species: 'kraken',
    rarity: 'legendary',
    stats: { atk: 80, hp: 80, spd: 20 },
    emoji: '🦑',
    name: '大海魔リヴァイアサンの頭',
    description: '海を支配する始祖海獣。津波を起こし大陸を沈める。',
    svgKey: 'head_kraken_5',
  },

  // ================================================================
  // 🐉 ドラゴン系・胴 (BODY x DRAGON) — HP特化 + ドラゴンATKボーナス
  // ================================================================
  {
    id: 'body_dragon_0',
    type: 'body',
    species: 'dragon',
    rarity: 'common',
    stats: { atk: 5, hp: 20, spd: 3 },
    emoji: '🟤',
    name: 'ドラゴンの幼胴',
    description: '鱗がまばらな幼竜の胴体。柔らかいが温かい。',
    svgKey: 'body_dragon_1',
  },
  {
    id: 'body_dragon_1',
    type: 'body',
    species: 'dragon',
    rarity: 'uncommon',
    stats: { atk: 9, hp: 36, spd: 5 },
    emoji: '🔶',
    name: 'ドラゴンの鱗胴',
    description: '硬い鱗に覆われた若竜の胴。剣では傷つかない。',
    svgKey: 'body_dragon_2',
  },
  {
    id: 'body_dragon_2',
    type: 'body',
    species: 'dragon',
    rarity: 'rare',
    stats: { atk: 15, hp: 60, spd: 8 },
    emoji: '🔶',
    name: 'ドラゴンの鋼胴',
    description: '溶岩で鍛えられた鋼鱗の胴。炎を浴びるほど硬くなる。',
    svgKey: 'body_dragon_3',
  },
  {
    id: 'body_dragon_3',
    type: 'body',
    species: 'dragon',
    rarity: 'epic',
    stats: { atk: 25, hp: 100, spd: 13 },
    emoji: '🟠',
    name: 'ドラゴンの溶岩胴',
    description: '体内にマグマが流れる古竜の胴。触れるだけで焼ける。',
    svgKey: 'body_dragon_4',
  },
  {
    id: 'body_dragon_4',
    type: 'body',
    species: 'dragon',
    rarity: 'legendary',
    stats: { atk: 40, hp: 160, spd: 20 },
    emoji: '🟠',
    name: '始祖竜バハムートの胴',
    description: '隕石の衝突にも耐える不滅の竜鱗。星の核と同じ密度を持つ。',
    svgKey: 'body_dragon_5',
  },

  // ================================================================
  // 🦅 フェニックス系・胴 (BODY x PHOENIX) — HP特化 + フェニックスSPDボーナス
  // ================================================================
  {
    id: 'body_phoenix_0',
    type: 'body',
    species: 'phoenix',
    rarity: 'common',
    stats: { atk: 3, hp: 15, spd: 8 },
    emoji: '🪶',
    name: 'フェニックスの雛胴',
    description: '温かな羽毛に包まれた雛の胴。軽くて風に乗りやすい。',
    svgKey: 'body_phoenix_1',
  },
  {
    id: 'body_phoenix_1',
    type: 'body',
    species: 'phoenix',
    rarity: 'uncommon',
    stats: { atk: 5, hp: 27, spd: 14 },
    emoji: '🪶',
    name: 'フェニックスの羽胴',
    description: '炎の羽毛が生え揃った若鳥の胴。触れると温かい。',
    svgKey: 'body_phoenix_2',
  },
  {
    id: 'body_phoenix_2',
    type: 'body',
    species: 'phoenix',
    rarity: 'rare',
    stats: { atk: 8, hp: 45, spd: 22 },
    emoji: '🔥',
    name: 'フェニックスの炎翼胴',
    description: '胴から直接炎の翼が生える。被弾しても灰から再生する。',
    svgKey: 'body_phoenix_3',
  },
  {
    id: 'body_phoenix_3',
    type: 'body',
    species: 'phoenix',
    rarity: 'epic',
    stats: { atk: 13, hp: 75, spd: 37 },
    emoji: '🔥',
    name: 'フェニックスの再生胴',
    description: '傷つくたびに炎で再生する不死鳥の胴。倒してもまた立ち上がる。',
    svgKey: 'body_phoenix_4',
  },
  {
    id: 'body_phoenix_4',
    type: 'body',
    species: 'phoenix',
    rarity: 'legendary',
    stats: { atk: 20, hp: 120, spd: 60 },
    emoji: '🔥',
    name: '永劫鳥スザクの胴',
    description: '太陽の炎を体内に宿す。破壊されても無限に蘇る永劫の器。',
    svgKey: 'body_phoenix_5',
  },

  // ================================================================
  // 🐙 クラーケン系・胴 (BODY x KRAKEN) — HP超特化
  // ================================================================
  {
    id: 'body_kraken_0',
    type: 'body',
    species: 'kraken',
    rarity: 'common',
    stats: { atk: 3, hp: 25, spd: 2 },
    emoji: '🫧',
    name: 'クラーケンの幼胴',
    description: 'ぷにぷにした深海生物の胴。驚くほど弾力がある。',
    svgKey: 'body_kraken_1',
  },
  {
    id: 'body_kraken_1',
    type: 'body',
    species: 'kraken',
    rarity: 'uncommon',
    stats: { atk: 5, hp: 45, spd: 4 },
    emoji: '🫧',
    name: 'クラーケンの墨胴',
    description: '墨袋が発達した海獣の胴。攻撃されると墨を噴射する。',
    svgKey: 'body_kraken_2',
  },
  {
    id: 'body_kraken_2',
    type: 'body',
    species: 'kraken',
    rarity: 'rare',
    stats: { atk: 8, hp: 75, spd: 6 },
    emoji: '🌊',
    name: 'クラーケンの鎧胴',
    description: '深海の水圧で鍛えられた外殻。鯨の体当たりにも耐える。',
    svgKey: 'body_kraken_3',
  },
  {
    id: 'body_kraken_3',
    type: 'body',
    species: 'kraken',
    rarity: 'epic',
    stats: { atk: 13, hp: 125, spd: 10 },
    emoji: '🌊',
    name: 'クラーケンの渦胴',
    description: '体の周囲に渦潮を纏う古代海獣の胴。近づく者を飲み込む。',
    svgKey: 'body_kraken_4',
  },
  {
    id: 'body_kraken_4',
    type: 'body',
    species: 'kraken',
    rarity: 'legendary',
    stats: { atk: 20, hp: 200, spd: 15 },
    emoji: '🌊',
    name: '大海魔リヴァイアサンの胴',
    description: '海そのものが鎧。マリアナ海溝の水圧すら感じない絶対の防御。',
    svgKey: 'body_kraken_5',
  },

  // ================================================================
  // 🐉 ドラゴン系・脚 (LEGS x DRAGON) — SPD特化 + ドラゴンATKボーナス
  // ================================================================
  {
    id: 'legs_dragon_0',
    type: 'legs',
    species: 'dragon',
    rarity: 'common',
    stats: { atk: 5, hp: 5, spd: 12 },
    emoji: '🦎',
    name: 'ドラゴンの幼脚',
    description: '小さな爪が生えた幼竜の脚。走るとぺたぺた音がする。',
    svgKey: 'legs_dragon_1',
  },
  {
    id: 'legs_dragon_1',
    type: 'legs',
    species: 'dragon',
    rarity: 'uncommon',
    stats: { atk: 9, hp: 9, spd: 22 },
    emoji: '🦎',
    name: 'ドラゴンの鉤脚',
    description: '鋭い鉤爪の若竜の脚。岩壁を駆け上がる。',
    svgKey: 'legs_dragon_2',
  },
  {
    id: 'legs_dragon_2',
    type: 'legs',
    species: 'dragon',
    rarity: 'rare',
    stats: { atk: 15, hp: 15, spd: 36 },
    emoji: '🐾',
    name: 'ドラゴンの烈脚',
    description: '地面を蹴れば地割れが起きる。爪の一撃は岩を砕く。',
    svgKey: 'legs_dragon_3',
  },
  {
    id: 'legs_dragon_3',
    type: 'legs',
    species: 'dragon',
    rarity: 'epic',
    stats: { atk: 25, hp: 25, spd: 60 },
    emoji: '🐾',
    name: 'ドラゴンの雷脚',
    description: '稲妻の速さで大地を踏みしめる古竜の脚。音速を超える。',
    svgKey: 'legs_dragon_4',
  },
  {
    id: 'legs_dragon_4',
    type: 'legs',
    species: 'dragon',
    rarity: 'legendary',
    stats: { atk: 40, hp: 40, spd: 96 },
    emoji: '🐾',
    name: '始祖竜バハムートの脚',
    description: '大地を支える四本の柱。一歩踏めば山が崩れ、谷が生まれる。',
    svgKey: 'legs_dragon_5',
  },

  // ================================================================
  // 🦅 フェニックス系・脚 (LEGS x PHOENIX) — SPD超特化
  // ================================================================
  {
    id: 'legs_phoenix_0',
    type: 'legs',
    species: 'phoenix',
    rarity: 'common',
    stats: { atk: 3, hp: 3, spd: 18 },
    emoji: '🐤',
    name: 'フェニックスの雛脚',
    description: '細くて頼りない雛の脚。しかし驚くほど素早い。',
    svgKey: 'legs_phoenix_1',
  },
  {
    id: 'legs_phoenix_1',
    type: 'legs',
    species: 'phoenix',
    rarity: 'uncommon',
    stats: { atk: 5, hp: 5, spd: 32 },
    emoji: '🦶',
    name: 'フェニックスの炎脚',
    description: '炎を纏う鳥脚。走った跡に火の道が残る。',
    svgKey: 'legs_phoenix_2',
  },
  {
    id: 'legs_phoenix_2',
    type: 'legs',
    species: 'phoenix',
    rarity: 'rare',
    stats: { atk: 8, hp: 8, spd: 52 },
    emoji: '🦶',
    name: 'フェニックスの疾脚',
    description: '目にも止まらぬ速さの鳥脚。風すら追いつけない。',
    svgKey: 'legs_phoenix_3',
  },
  {
    id: 'legs_phoenix_3',
    type: 'legs',
    species: 'phoenix',
    rarity: 'epic',
    stats: { atk: 13, hp: 13, spd: 87 },
    emoji: '💨',
    name: 'フェニックスの刹那脚',
    description: '一瞬で世界を一周する不死鳥の脚。残像すら見えない。',
    svgKey: 'legs_phoenix_4',
  },
  {
    id: 'legs_phoenix_4',
    type: 'legs',
    species: 'phoenix',
    rarity: 'legendary',
    stats: { atk: 20, hp: 20, spd: 140 },
    emoji: '💨',
    name: '永劫鳥スザクの脚',
    description: '時を超える速さ。過去も未来もスザクの脚の前では静止する。',
    svgKey: 'legs_phoenix_5',
  },

  // ================================================================
  // 🐙 クラーケン系・脚 (LEGS x KRAKEN) — SPD特化 + クラーケンHPボーナス
  // ================================================================
  {
    id: 'legs_kraken_0',
    type: 'legs',
    species: 'kraken',
    rarity: 'common',
    stats: { atk: 3, hp: 10, spd: 10 },
    emoji: '🦑',
    name: 'クラーケンの触脚',
    description: 'にゅるにゅる動く触手の脚。滑りやすい地形も平気。',
    svgKey: 'legs_kraken_1',
  },
  {
    id: 'legs_kraken_1',
    type: 'legs',
    species: 'kraken',
    rarity: 'uncommon',
    stats: { atk: 5, hp: 18, spd: 18 },
    emoji: '🦑',
    name: 'クラーケンの吸脚',
    description: '吸盤だらけの太い触手脚。どんな壁も天井も歩ける。',
    svgKey: 'legs_kraken_2',
  },
  {
    id: 'legs_kraken_2',
    type: 'legs',
    species: 'kraken',
    rarity: 'rare',
    stats: { atk: 8, hp: 30, spd: 30 },
    emoji: '🐙',
    name: 'クラーケンの巻脚',
    description: '船の錨を引きちぎる巻きつき触手。締め付けは鉄のように硬い。',
    svgKey: 'legs_kraken_3',
  },
  {
    id: 'legs_kraken_3',
    type: 'legs',
    species: 'kraken',
    rarity: 'epic',
    stats: { atk: 13, hp: 50, spd: 50 },
    emoji: '🐙',
    name: 'クラーケンの大触脚',
    description: '海底を這い回る巨大触手。島ごと引きずり込む力がある。',
    svgKey: 'legs_kraken_4',
  },
  {
    id: 'legs_kraken_4',
    type: 'legs',
    species: 'kraken',
    rarity: 'legendary',
    stats: { atk: 20, hp: 80, spd: 80 },
    emoji: '🐙',
    name: '大海魔リヴァイアサンの触脚',
    description: '大陸を繋ぐ無限の触手。海の底から世界中どこへでも伸びる。',
    svgKey: 'legs_kraken_5',
  },
];

/**
 * PartDefをIDで検索するヘルパー
 */
export function getPartDef(defId: string): PartDef | undefined {
  return PARTS_DATA.find(p => p.id === defId);
}

/**
 * タイプ別フィルター
 */
export function getPartsByType(type: string): PartDef[] {
  return PARTS_DATA.filter(p => p.type === type);
}

/**
 * 種族別フィルター
 */
export function getPartsBySpecies(species: string): PartDef[] {
  return PARTS_DATA.filter(p => p.species === species);
}
```

### 5.1 ステータスサマリーテーブル

| ID | 名前 | タイプ | 種族 | レア | ATK | HP | SPD | 合計 |
|---|---|---|---|---|---|---|---|---|
| head_dragon_0 | ドラゴンの幼頭 | head | dragon | C | 15 | 5 | 3 | 23 |
| head_dragon_1 | ドラゴンの角頭 | head | dragon | U | 27 | 9 | 5 | 41 |
| head_dragon_2 | ドラゴンの烈頭 | head | dragon | R | 45 | 15 | 8 | 68 |
| head_dragon_3 | ドラゴンの覇頭 | head | dragon | E | 75 | 25 | 13 | 113 |
| head_dragon_4 | 始祖竜バハムートの頭 | head | dragon | L | 120 | 40 | 20 | 180 |
| head_phoenix_0 | フェニックスの雛頭 | head | phoenix | C | 12 | 3 | 8 | 23 |
| head_phoenix_1 | フェニックスの炎頭 | head | phoenix | U | 22 | 5 | 14 | 41 |
| head_phoenix_2 | フェニックスの烈嘴 | head | phoenix | R | 38 | 8 | 22 | 68 |
| head_phoenix_3 | フェニックスの焔冠 | head | phoenix | E | 63 | 13 | 37 | 113 |
| head_phoenix_4 | 永劫鳥スザクの頭 | head | phoenix | L | 100 | 20 | 60 | 180 |
| head_kraken_0 | クラーケンの幼頭 | head | kraken | C | 10 | 10 | 3 | 23 |
| head_kraken_1 | クラーケンの吸頭 | head | kraken | U | 18 | 18 | 5 | 41 |
| head_kraken_2 | クラーケンの裂顎 | head | kraken | R | 30 | 30 | 8 | 68 |
| head_kraken_3 | クラーケンの深淵頭 | head | kraken | E | 50 | 50 | 13 | 113 |
| head_kraken_4 | 大海魔リヴァイアサンの頭 | head | kraken | L | 80 | 80 | 20 | 180 |
| body_dragon_0 | ドラゴンの幼胴 | body | dragon | C | 5 | 20 | 3 | 28 |
| body_dragon_1 | ドラゴンの鱗胴 | body | dragon | U | 9 | 36 | 5 | 50 |
| body_dragon_2 | ドラゴンの鋼胴 | body | dragon | R | 15 | 60 | 8 | 83 |
| body_dragon_3 | ドラゴンの溶岩胴 | body | dragon | E | 25 | 100 | 13 | 138 |
| body_dragon_4 | 始祖竜バハムートの胴 | body | dragon | L | 40 | 160 | 20 | 220 |
| body_phoenix_0 | フェニックスの雛胴 | body | phoenix | C | 3 | 15 | 8 | 26 |
| body_phoenix_1 | フェニックスの羽胴 | body | phoenix | U | 5 | 27 | 14 | 46 |
| body_phoenix_2 | フェニックスの炎翼胴 | body | phoenix | R | 8 | 45 | 22 | 75 |
| body_phoenix_3 | フェニックスの再生胴 | body | phoenix | E | 13 | 75 | 37 | 125 |
| body_phoenix_4 | 永劫鳥スザクの胴 | body | phoenix | L | 20 | 120 | 60 | 200 |
| body_kraken_0 | クラーケンの幼胴 | body | kraken | C | 3 | 25 | 2 | 30 |
| body_kraken_1 | クラーケンの墨胴 | body | kraken | U | 5 | 45 | 4 | 54 |
| body_kraken_2 | クラーケンの鎧胴 | body | kraken | R | 8 | 75 | 6 | 89 |
| body_kraken_3 | クラーケンの渦胴 | body | kraken | E | 13 | 125 | 10 | 148 |
| body_kraken_4 | 大海魔リヴァイアサンの胴 | body | kraken | L | 20 | 200 | 15 | 235 |
| legs_dragon_0 | ドラゴンの幼脚 | legs | dragon | C | 5 | 5 | 12 | 22 |
| legs_dragon_1 | ドラゴンの鉤脚 | legs | dragon | U | 9 | 9 | 22 | 40 |
| legs_dragon_2 | ドラゴンの烈脚 | legs | dragon | R | 15 | 15 | 36 | 66 |
| legs_dragon_3 | ドラゴンの雷脚 | legs | dragon | E | 25 | 25 | 60 | 110 |
| legs_dragon_4 | 始祖竜バハムートの脚 | legs | dragon | L | 40 | 40 | 96 | 176 |
| legs_phoenix_0 | フェニックスの雛脚 | legs | phoenix | C | 3 | 3 | 18 | 24 |
| legs_phoenix_1 | フェニックスの炎脚 | legs | phoenix | U | 5 | 5 | 32 | 42 |
| legs_phoenix_2 | フェニックスの疾脚 | legs | phoenix | R | 8 | 8 | 52 | 68 |
| legs_phoenix_3 | フェニックスの刹那脚 | legs | phoenix | E | 13 | 13 | 87 | 113 |
| legs_phoenix_4 | 永劫鳥スザクの脚 | legs | phoenix | L | 20 | 20 | 140 | 180 |
| legs_kraken_0 | クラーケンの触脚 | legs | kraken | C | 3 | 10 | 10 | 23 |
| legs_kraken_1 | クラーケンの吸脚 | legs | kraken | U | 5 | 18 | 18 | 41 |
| legs_kraken_2 | クラーケンの巻脚 | legs | kraken | R | 8 | 30 | 30 | 68 |
| legs_kraken_3 | クラーケンの大触脚 | legs | kraken | E | 13 | 50 | 50 | 113 |
| legs_kraken_4 | 大海魔リヴァイアサンの触脚 | legs | kraken | L | 20 | 80 | 80 | 180 |

### 5.2 ステータスバランス設計意図

```
■ 同レア度での合計ステータスは種族間でほぼ均一（±10%）
  → 「どの種族が強い」ではなく「どのビルドが好きか」で選ぶ

■ レア度間の倍率:
  Common(1.0x) → Uncommon(1.8x) → Rare(3.0x) → Epic(5.0x) → Legendary(8.0x)
  → マージの報われ感を担保（2段階上のパーツは3倍の強さ）

■ ビルド戦略の3すくみ:
  1. ATK型（ドラゴン頭+ドラゴン胴+ドラゴン脚）: 火力で押し潰す
  2. SPD型（フェニックス頭+フェニックス胴+フェニックス脚）: 先手必勝
  3. HP型（クラーケン頭+クラーケン胴+クラーケン脚）: 耐えて勝つ
  → 混成ビルド（ドラゴン頭+クラーケン胴+フェニックス脚）がバランス型
```

---

## 6. 収益化設計

### 6.1 AdMob配置

| 広告タイプ | 配置場所 | タイミング | 頻度 |
|---|---|---|---|
| バナー (320x50) | 闘技場画面下部 | 常時表示 | 常時 |
| バナー (320x50) | ショップ画面下部 | 常時表示 | 常時 |
| インターステシャル | 対戦結果表示後 | 3戦ごとに1回 | 3回に1回 |
| リワード動画 | 対戦勝利後「報酬2倍」 | 勝利時に任意 | 無制限 |
| リワード動画 | ショップ「広告で部位ゲット」 | 任意 | 1日3回 |
| リワード動画 | マージ失敗時「もう1回」 | ※将来機能 | - |

**AdMob Unit ID管理**:
```typescript
// src/constants/config.ts
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
```

**インターステシャル表示ロジック**:
```typescript
// 3戦に1回のインターステシャル
const battleCount = useRef(0);

const onBattleEnd = async () => {
  battleCount.current += 1;
  if (battleCount.current % 3 === 0 && !gameState.adFree) {
    await showInterstitial();
  }
};
```

### 6.2 IAP商品リスト (RevenueCat)

| 商品ID | 商品名 | 価格 | タイプ | 内容 |
|---|---|---|---|---|
| `chimera_ad_remove` | 広告除去パック | ¥480 | 非消費型 | 全広告非表示（リワードは任意視聴可） |
| `chimera_starter_pack` | スターターパック | ¥980 | 非消費型 | Rare部位3個 + 1000コイン + インベントリ+20 |
| `chimera_inventory_50` | インベントリ拡張 | ¥320 | 非消費型 | インベントリ+50枠 |
| `chimera_coins_500` | コイン500枚 | ¥160 | 消費型 | 500コイン |
| `chimera_coins_1200` | コイン1200枚 | ¥320 | 消費型 | 1200コイン（+200ボーナス） |
| `chimera_coins_3000` | コイン3000枚 | ¥650 | 消費型 | 3000コイン（+500ボーナス） |
| `chimera_legendary_pack` | レジェンダリーパック | ¥1,480 | 非消費型 | ランダムLegendary部位1個 + 2000コイン |

### 6.3 RevenueCat統合

```typescript
// src/hooks/usePurchases.ts

import Purchases, {
  PurchasesPackage,
  CustomerInfo,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_API_KEY = Platform.select({
  ios: 'appl_XXXXXXXXXXXXXXXXXXXXXXXX',
  android: 'goog_XXXXXXXXXXXXXXXXXXXXXXXX',
}) as string;

export function usePurchases() {
  const initPurchases = async () => {
    Purchases.configure({ apiKey: REVENUECAT_API_KEY });
  };

  const getOfferings = async (): Promise<PurchasesPackage[]> => {
    const offerings = await Purchases.getOfferings();
    return offerings.current?.availablePackages ?? [];
  };

  const purchase = async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return checkEntitlements(customerInfo);
    } catch (e: any) {
      if (e.userCancelled) return false;
      throw e;
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    const customerInfo = await Purchases.restorePurchases();
    return checkEntitlements(customerInfo);
  };

  const checkEntitlements = (info: CustomerInfo): boolean => {
    return info.entitlements.active['ad_free'] !== undefined;
  };

  return { initPurchases, getOfferings, purchase, restorePurchases };
}
```

**RevenueCat設定**:
- Entitlements: `ad_free` (広告除去)、`premium` (スターター+レジェンダリーパック)
- Offerings: `default` に全商品を登録
- Products: Apple App Store / Google Play の商品IDとマッピング

---

## 7. アプリ特有機能

### 7.1 ハプティクス設計

```typescript
// src/hooks/useHaptics.ts

import * as Haptics from 'expo-haptics';

export function useHaptics() {
  return {
    /** UIタップ（ボタン押下など） */
    tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),

    /** 部位をドラッグ開始 */
    dragStart: () => Haptics.selectionAsync(),

    /** 部位をスロットにドロップ成功 */
    equipSuccess: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

    /** マージ成功 */
    mergeSuccess: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

    /** マージ失敗（条件不一致） */
    mergeFail: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

    /** Legendaryマージ成功（特別強い） */
    mergeLegendary: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

    /** 対戦ヒット（通常） */
    battleHit: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

    /** クリティカルヒット */
    battleCritical: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),

    /** 勝利 */
    battleWin: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),

    /** 敗北 */
    battleLose: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),

    /** ガチャ演出（カードフリップ） */
    gachaFlip: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),

    /** Legendaryガチャ演出 */
    gachaLegendary: async () => {
      // 3連続振動（ドラムロール風）
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await new Promise(r => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await new Promise(r => setTimeout(r, 100));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    },
  };
}
```

| イベント | ハプティクスタイプ | 強さ |
|---|---|---|
| UIタップ | Impact | Light |
| ドラッグ開始 | Selection | - |
| 装備成功 | Impact | Medium |
| マージ成功 | Notification | Success |
| マージ失敗 | Notification | Error |
| Legendaryマージ | Impact | Heavy |
| 通常攻撃ヒット | Impact | Medium |
| クリティカルヒット | Impact | Heavy |
| 勝利 | Notification | Success |
| 敗北 | Notification | Error |
| ガチャフリップ | Impact | Medium |
| Legendaryガチャ | Impact x3 | Light→Medium→Heavy |

### 7.2 プッシュ通知設計

```typescript
// src/hooks/useNotifications.ts

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

/**
 * ローカル通知のみ使用（サーバー不要）
 * リモート通知はv2.0以降で検討
 */

export const NOTIFICATION_SCHEDULE = {
  /** デイリーログインリマインダー: 毎朝9:00 JST */
  dailyReminder: {
    id: 'daily_reminder',
    title: '🐉 今日のキメラチェック！',
    body: 'デイリーボーナスで新しい部位をゲットしよう！',
    trigger: {
      hour: 9,
      minute: 0,
      repeats: true,
    },
  },
  /** トーナメントリマインダー: 毎日20:00 JST */
  tournamentReminder: {
    id: 'tournament_reminder',
    title: '⚔️ 闘技場が待っている！',
    body: '今日のトーナメントにまだ参加していません。挑戦しよう！',
    trigger: {
      hour: 20,
      minute: 0,
      repeats: true,
    },
  },
  /** 離脱防止: 24時間未プレイで送信 */
  comebackReminder: {
    id: 'comeback_reminder',
    title: '🦅 キメラが寂しがっています...',
    body: 'あなたのキメラが闘技場で戦いたがっています！',
    trigger: {
      seconds: 86400, // 24時間後
      repeats: false,
    },
  },
  /** 離脱防止: 72時間未プレイで送信 */
  comebackUrgent: {
    id: 'comeback_urgent',
    title: '🎁 お帰りなさい！ボーナスをご用意しました',
    body: '72時間ぶりの復帰ボーナス: Rare部位1個プレゼント！',
    trigger: {
      seconds: 259200, // 72時間後
      repeats: false,
    },
  },
};

export function useNotifications() {
  const requestPermission = async (): Promise<boolean> => {
    if (!Device.isDevice) return false;
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  };

  const scheduleAll = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();

    // デイリーリマインダー
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.dailyReminder.title,
        body: NOTIFICATION_SCHEDULE.dailyReminder.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: NOTIFICATION_SCHEDULE.dailyReminder.trigger.hour,
        minute: NOTIFICATION_SCHEDULE.dailyReminder.trigger.minute,
      },
    });

    // トーナメントリマインダー
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.tournamentReminder.title,
        body: NOTIFICATION_SCHEDULE.tournamentReminder.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: NOTIFICATION_SCHEDULE.tournamentReminder.trigger.hour,
        minute: NOTIFICATION_SCHEDULE.tournamentReminder.trigger.minute,
      },
    });

    // 離脱防止（24h）
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.comebackReminder.title,
        body: NOTIFICATION_SCHEDULE.comebackReminder.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: NOTIFICATION_SCHEDULE.comebackReminder.trigger.seconds,
        repeats: false,
      },
    });

    // 離脱防止（72h）
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.comebackUrgent.title,
        body: NOTIFICATION_SCHEDULE.comebackUrgent.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: NOTIFICATION_SCHEDULE.comebackUrgent.trigger.seconds,
        repeats: false,
      },
    });
  };

  /** アプリ起動時に離脱防止タイマーをリセット */
  const resetComebackTimers = async () => {
    // 既存の離脱防止通知をキャンセルして再スケジュール
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (
        notif.identifier === 'comeback_reminder' ||
        notif.identifier === 'comeback_urgent'
      ) {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
    // 再スケジュール（現在から24h/72h後）
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.comebackReminder.title,
        body: NOTIFICATION_SCHEDULE.comebackReminder.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 86400,
        repeats: false,
      },
    });
    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_SCHEDULE.comebackUrgent.title,
        body: NOTIFICATION_SCHEDULE.comebackUrgent.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 259200,
        repeats: false,
      },
    });
  };

  return { requestPermission, scheduleAll, resetComebackTimers };
}
```

### 7.3 Game Center / Google Play Games 実績リスト

| 実績ID | 実績名 | 条件 | ポイント |
|---|---|---|---|
| `first_merge` | はじめての合成 | 初めてマージを成功させる | 10 |
| `merge_10` | 合成マニア | マージを10回成功させる | 20 |
| `merge_50` | 合成マスター | マージを50回成功させる | 30 |
| `merge_100` | 合成の錬金術師 | マージを100回成功させる | 50 |
| `first_legendary` | 伝説の目覚め | 初めてLegendary部位を入手 | 50 |
| `first_battle_win` | 初勝利 | 闘技場で初勝利 | 10 |
| `win_streak_5` | 連勝街道 | 5連勝を達成 | 30 |
| `win_streak_10` | 無敵のキメラ | 10連勝を達成 | 50 |
| `tournament_win` | トーナメント覇者 | トーナメントで優勝 | 50 |
| `tournament_win_5` | 闘技場の王 | トーナメント5回優勝 | 100 |
| `codex_15` | 種族コレクター | 1種族15部位をコンプリート | 30 |
| `codex_30` | 博識なる者 | 30部位を図鑑に登録 | 40 |
| `codex_45` | キメラマスター | 全45部位を図鑑に登録 | 100 |
| `arena_rank_5` | 中級闘士 | 闘技場ランク5に到達 | 30 |
| `arena_rank_10` | 最強闘士 | 闘技場ランク10に到達 | 100 |
| `full_legendary` | 神話の構築者 | 全スロットにLegendary部位を装備 | 100 |
| `daily_7` | 1週間ログイン | 7日連続ログイン | 20 |
| `daily_30` | 1ヶ月ログイン | 30日連続ログイン | 50 |
| `coins_10000` | 富豪キメラ師 | 累計10000コイン獲得 | 30 |
| `share_first` | 布教者 | 初めてキメラをシェア | 10 |

---

## 8. データ永続化

### 8.1 AsyncStorageキー設計

```typescript
// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types';

/**
 * AsyncStorageキー一覧
 *
 * プレフィックス: @chimera_
 * 全データ合計: 推定 50-200KB（AsyncStorage上限の6MB内で十分）
 */
export const STORAGE_KEYS = {
  /** ゲーム状態全体（JSON） — 最大約150KB */
  GAME_STATE: '@chimera_game_state',

  /** BGM ON/OFF (boolean) */
  BGM_ENABLED: '@chimera_bgm_enabled',

  /** SE ON/OFF (boolean) */
  SE_ENABLED: '@chimera_se_enabled',

  /** ハプティクス ON/OFF (boolean) */
  HAPTICS_ENABLED: '@chimera_haptics_enabled',

  /** 通知許可済み (boolean) */
  NOTIFICATIONS_GRANTED: '@chimera_notifications_granted',

  /** 初回起動済み (boolean) */
  FIRST_LAUNCH_DONE: '@chimera_first_launch',

  /** 広告視聴カウント（日次リセット用） {"date": "2026-03-20", "count": 2} */
  AD_WATCH_COUNT: '@chimera_ad_watch_count',

  /** 前回のアプリバージョン（マイグレーション用） */
  APP_VERSION: '@chimera_app_version',
} as const;

/**
 * ゲーム状態を保存
 */
export async function saveGameState(state: GameState): Promise<void> {
  const json = JSON.stringify(state);
  await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, json);
}

/**
 * ゲーム状態を読込
 */
export async function loadGameState(): Promise<GameState | null> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
  if (!json) return null;
  try {
    return JSON.parse(json) as GameState;
  } catch {
    return null;
  }
}

/**
 * 初期ゲーム状態
 */
export function createInitialGameState(): GameState {
  return {
    inventory: [],
    inventoryLimit: 50,
    chimera: {
      name: 'キメラ',
      slots: { head: null, body: null, legs: null },
      totalStats: { atk: 0, hp: 0, spd: 0 },
      power: 0,
    },
    record: {
      totalBattles: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      maxWinStreak: 0,
      currentWinStreak: 0,
      tournamentWins: 0,
    },
    coins: 0,
    codexDiscovered: [],
    currentTournament: null,
    arenaRank: 1,
    totalMerges: 0,
    lastPlayedAt: new Date().toISOString(),
    tutorialCompleted: false,
    adFree: false,
    achievementsUnlocked: [],
    lastDailyRewardDate: null,
    dailyStreak: 0,
  };
}

/**
 * 設定値の読み書きヘルパー
 */
export async function getSetting(key: string): Promise<boolean> {
  const val = await AsyncStorage.getItem(key);
  return val === 'true';
}

export async function setSetting(key: string, value: boolean): Promise<void> {
  await AsyncStorage.setItem(key, value.toString());
}

/**
 * リワード広告の日次カウント管理
 */
export async function getAdWatchCount(): Promise<number> {
  const json = await AsyncStorage.getItem(STORAGE_KEYS.AD_WATCH_COUNT);
  if (!json) return 0;
  try {
    const data = JSON.parse(json);
    const today = new Date().toISOString().split('T')[0];
    if (data.date !== today) return 0; // 日付変わったらリセット
    return data.count;
  } catch {
    return 0;
  }
}

export async function incrementAdWatchCount(): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const current = await getAdWatchCount();
  await AsyncStorage.setItem(
    STORAGE_KEYS.AD_WATCH_COUNT,
    JSON.stringify({ date: today, count: current + 1 })
  );
}
```

### 8.2 保存タイミング

| イベント | 保存対象 | タイミング |
|---|---|---|
| マージ成功 | GAME_STATE | 即時 |
| 装備変更 | GAME_STATE | 即時 |
| 対戦終了 | GAME_STATE | 即時 |
| コイン変動 | GAME_STATE | 即時 |
| IAP購入完了 | GAME_STATE | 即時 |
| アプリバックグラウンド | GAME_STATE | AppState 'background' イベント |
| 設定変更 | 個別キー | 即時 |

---

## 9. シェア機能

### 9.1 キメラスクリーンショット生成

```typescript
// src/utils/screenshot.ts

import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ChimeraDef, Stats } from '../types';

/**
 * キメラプレビューのスクリーンショットを生成
 *
 * サイズ: 1200 x 630px (OGP最適サイズ)
 * 背景: グラデーション（#0D0D1A → #1A1A3E）
 * 内容:
 *   - キメラSVG描画（中央大きく）
 *   - キメラ名
 *   - ステータスバー（ATK/HP/SPD）
 *   - 戦闘力
 *   - 「合成キメラ / Chimera Forge」ロゴ（右下）
 */
export async function captureChimeraCard(
  viewRef: React.RefObject<any>
): Promise<string> {
  const uri = await captureRef(viewRef, {
    format: 'png',
    quality: 1.0,
    width: 1200,
    height: 630,
  });

  // キャッシュディレクトリにコピー
  const filename = `chimera_${Date.now()}.png`;
  const dest = `${FileSystem.cacheDirectory}${filename}`;
  await FileSystem.copyAsync({ from: uri, to: dest });

  return dest;
}

/**
 * キメラカードをシェア
 */
export async function shareChimeraCard(
  viewRef: React.RefObject<any>,
  chimera: ChimeraDef
): Promise<void> {
  const imageUri = await captureChimeraCard(viewRef);

  const isAvailable = await Sharing.isAvailableAsync();
  if (!isAvailable) return;

  await Sharing.shareAsync(imageUri, {
    mimeType: 'image/png',
    dialogTitle: 'キメラをシェア',
    UTI: 'public.png',
  });
}
```

### 9.2 対戦結果シェアテキスト

```typescript
// src/utils/share.ts

import { BattleResult, ChimeraDef, EnemyDef, Stats } from '../types';
import * as Sharing from 'expo-sharing';

/**
 * 対戦結果のシェアテキスト生成
 *
 * 例（勝利時）:
 * ━━━━━━━━━━━━━━━
 * ⚔️ 合成キメラ 対戦結果 ⚔️
 *
 * 🐉 ドラゴニクス (⚡400)
 *    🆚
 * 🦁 ライオニクス (⚡290)
 *
 * 結果: 🎉 WIN!
 * HP残り: 120/200
 * ターン数: 4
 * クリティカル: 1回
 *
 * #合成キメラ #ChimeraForge
 * ━━━━━━━━━━━━━━━
 */
export function generateBattleShareText(
  result: BattleResult,
  playerChimera: ChimeraDef,
  enemy: EnemyDef
): string {
  const resultEmoji = result.winner === 'player' ? '🎉 WIN!' :
                      result.winner === 'enemy' ? '😢 LOSE...' : '🤝 DRAW';
  const criticals = result.turns.filter(t => t.isCritical && t.attacker === 'player').length;

  return [
    '━━━━━━━━━━━━━━━',
    '⚔️ 合成キメラ 対戦結果 ⚔️',
    '',
    `🐉 ${playerChimera.name} (⚡${playerChimera.power})`,
    '   🆚',
    `${enemy.emoji} ${enemy.name} (⚡${enemy.totalStats.atk + enemy.totalStats.hp + enemy.totalStats.spd})`,
    '',
    `結果: ${resultEmoji}`,
    `HP残り: ${result.playerFinalHp}/${playerChimera.totalStats.hp}`,
    `ターン数: ${result.turns.length}`,
    criticals > 0 ? `クリティカル: ${criticals}回 💥` : '',
    '',
    '#合成キメラ #ChimeraForge',
    '━━━━━━━━━━━━━━━',
  ].filter(Boolean).join('\n');
}

/**
 * テキストをシェア（クリップボードにコピー + シェアシート）
 */
export async function shareText(text: string): Promise<void> {
  // expo-sharingはファイル共有のみ対応のため、
  // テキストシェアはReact NativeのShare APIを使用
  const { Share } = require('react-native');
  await Share.share({ message: text });
}
```

### 9.3 シェアトリガー

| トリガー | シェア形式 | 内容 |
|---|---|---|
| メイン画面「シェア」ボタン | 画像 + テキスト | キメラカード画像(1200x630) + 名前+ステータス |
| 対戦結果画面「シェア」ボタン | テキスト | 対戦結果テキスト |
| 図鑑コンプリート時 | 画像 | 図鑑進捗カード |
| Legendaryマージ成功時 | 画像 | 新部位カード画像 |

---

## 10. キメラ描画システム

### 10.1 SVGパーツの合成方法

```typescript
// src/components/ChimeraPreview.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { G, Use, Defs } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { PartDef } from '../types';

/**
 * キメラ描画の仕組み:
 *
 * 1. 各部位SVGは独立したコンポーネント（45個 = 3タイプ x 3種族 x 5レア度）
 * 2. 描画キャンバス: 240 x 320 dp（スマホ画面の上部1/3に収まるサイズ）
 * 3. 各パーツの配置位置（アンカーポイント）:
 *    - 頭(HEAD): y=0~100, 中央配置 (x=60~180)
 *    - 胴(BODY): y=80~220, 中央配置 (x=40~200)
 *    - 脚(LEGS): y=200~320, 中央配置 (x=50~190)
 * 4. パーツ間のオーバーラップ: 20dp（自然な繋がりを演出）
 * 5. レア度でエフェクト変化:
 *    - Common: なし
 *    - Uncommon: 薄い光の輪
 *    - Rare: 青い光のパーティクル
 *    - Epic: 紫のオーラ
 *    - Legendary: 金色のオーラ + パーティクル + 光線
 */

// パーツSVGのインポートマップ
const SVG_COMPONENTS: Record<string, React.FC<{ width: number; height: number }>> = {
  // ※ 実際の実装では react-native-svg-transformer を使用して
  //    SVGファイルをReactコンポーネントとしてインポートする
  //
  // 例:
  // import HeadDragon1 from '../assets/svg/heads/head_dragon_1.svg';
  // 'head_dragon_1': HeadDragon1,
  //
  // v1.0ではemoji描画で代替（SVG資産は後から差し替え可能）
};

interface ChimeraPreviewProps {
  headDef: PartDef | null;
  bodyDef: PartDef | null;
  legsDef: PartDef | null;
  size?: 'small' | 'medium' | 'large'; // small=80dp, medium=160dp, large=240dp
}

const AnimatedView = Animated.createAnimatedComponent(View);

export const ChimeraPreview: React.FC<ChimeraPreviewProps> = ({
  headDef,
  bodyDef,
  legsDef,
  size = 'large',
}) => {
  const dimensions = {
    small: { width: 80, height: 106 },
    medium: { width: 160, height: 213 },
    large: { width: 240, height: 320 },
  }[size];

  // 待機アニメーション（上下に浮遊）
  const floatY = useSharedValue(0);
  React.useEffect(() => {
    floatY.value = withRepeat(
      withTiming(8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // 無限繰り返し
      true // 往復
    );
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <AnimatedView style={[styles.container, dimensions, floatStyle]}>
      {/* 背景オーラ（最高レア度に応じて変化） */}
      <AuraEffect
        rarity={getHighestRarity(headDef, bodyDef, legsDef)}
        size={dimensions}
      />

      {/* 脚 (最背面) */}
      <View style={[styles.partLayer, styles.legsPosition]}>
        {legsDef ? (
          <PartRenderer def={legsDef} width={dimensions.width * 0.6} height={dimensions.height * 0.38} />
        ) : (
          <PlaceholderPart label="脚" />
        )}
      </View>

      {/* 胴 (中間) */}
      <View style={[styles.partLayer, styles.bodyPosition]}>
        {bodyDef ? (
          <PartRenderer def={bodyDef} width={dimensions.width * 0.7} height={dimensions.height * 0.44} />
        ) : (
          <PlaceholderPart label="胴" />
        )}
      </View>

      {/* 頭 (最前面) */}
      <View style={[styles.partLayer, styles.headPosition]}>
        {headDef ? (
          <PartRenderer def={headDef} width={dimensions.width * 0.5} height={dimensions.height * 0.31} />
        ) : (
          <PlaceholderPart label="頭" />
        )}
      </View>
    </AnimatedView>
  );
};

/**
 * v1.0: emoji描画でMVP実装
 * v2.0: SVGコンポーネントに差し替え
 */
const PartRenderer: React.FC<{
  def: PartDef;
  width: number;
  height: number;
}> = ({ def, width, height }) => {
  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <Animated.Text style={{ fontSize: Math.min(width, height) * 0.6 }}>
        {def.emoji}
      </Animated.Text>
    </View>
  );
};

// ... styles省略
```

### 10.2 SVG資産仕様（v2.0実装予定、v1.0はemoji描画）

```
■ SVGファイル仕様:
  - キャンバスサイズ: 各パーツ 200x200 viewBox
  - アンカーポイント: 中央(100, 100)
  - 接続ポイント:
    - 頭: 下部(100, 190)が胴の上部と接続
    - 胴: 上部(100, 10)が頭と接続、下部(100, 190)が脚と接続
    - 脚: 上部(100, 10)が胴の下部と接続
  - 色: 種族ごとのベースカラー
    - dragon: #FF6B35 (炎オレンジ)
    - phoenix: #FF2D55 (深紅)
    - kraken: #30D5C8 (深海シアン)
  - レア度エフェクト: SVG filter で実装
    - Common: なし
    - Uncommon: drop-shadow(0 0 4px {speciesColor})
    - Rare: drop-shadow(0 0 8px {speciesColor}) + feGaussianBlur
    - Epic: Animated gradient stroke
    - Legendary: Gold gradient fill + animated sparkle particles

■ 命名規則: {type}_{species}_{rarityIndex+1}.svg
  例: head_dragon_1.svg (Common), head_dragon_5.svg (Legendary)

■ ファイル数: 45個（15頭 + 15胴 + 15脚）
```

### 10.3 アニメーション仕様

| アニメーション | ライブラリ | パラメータ | 対象 |
|---|---|---|---|
| 待機浮遊 | Reanimated | `withRepeat(withTiming(8, {duration:2000}), -1, true)` | ChimeraPreview全体 |
| マージ合体 | Reanimated | 2つのカードが中央に吸い寄せられる → 1つに合体（scale 1→0 + 0→1.2→1） duration: 800ms | MergeStation |
| マージエフェクト | Lottie | 光の爆発パーティクル (merge_effect.json) duration: 800ms | MergeStation中央 |
| 装備スナップ | Reanimated | `withSpring({damping: 12, stiffness: 180})` でスロットにスナップ | PartCard→PartSlot |
| 攻撃突進 | Reanimated | `withSequence(withTiming(30, {duration:100}), withTiming(0, {duration:200}))` | BattleAnimation キメラ |
| ダメージ数字 | Reanimated | `translateY: -40, opacity: 1→0, duration: 600ms` | BattleAnimation テキスト |
| HPバー減少 | Reanimated | `withTiming(newWidth, {duration:300})` | BattleAnimation HPバー |
| 画面振動(クリティカル) | Reanimated | `withSequence(withTiming(5), withTiming(-5), withTiming(3), withTiming(-3), withTiming(0))` 各50ms | BattleAnimation 画面全体 |
| 勝利紙吹雪 | Lottie | confetti.json duration: 2000ms | BattleResultModal |
| カードフリップ(ガチャ) | Reanimated | `rotateY: 0→180, duration: 500ms` (backface-visibility: hidden) | ShopItem |
| レア度光(Legendary) | Reanimated | 金色のglowが脈動 `withRepeat(withTiming(opacity: 0.3→1), -1, true)` duration: 1500ms | PartCard枠 |

### 10.4 カラーパレット

```typescript
// src/constants/colors.ts

export const COLORS = {
  // 背景
  bg: {
    primary: '#0D0D1A',      // ダークネイビー（メイン背景）
    secondary: '#1A1A3E',    // やや明るいネイビー（カード背景）
    surface: '#252550',      // サーフェス
    overlay: 'rgba(0,0,0,0.7)', // モーダルオーバーレイ
  },

  // テキスト
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0CC',
    muted: '#6B6B8D',
  },

  // レア度
  rarity: {
    common: '#9E9E9E',
    uncommon: '#4CAF50',
    rare: '#2196F3',
    epic: '#9C27B0',
    legendary: '#FF9800',
    legendaryGlow: '#FFD700',
  },

  // 種族
  species: {
    dragon: '#FF6B35',
    phoenix: '#FF2D55',
    kraken: '#30D5C8',
  },

  // ステータス
  stat: {
    atk: '#FF4444',
    hp: '#44FF44',
    spd: '#4488FF',
  },

  // HPバー
  hpBar: {
    high: '#4CAF50',     // 100-50%
    medium: '#FFC107',   // 50-20%
    low: '#F44336',      // 20-0%
  },

  // UI
  ui: {
    accent: '#7C4DFF',     // メインアクセント（紫）
    accentLight: '#B388FF',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FFC107',
    border: '#3D3D6B',
    cardBorder: '#4A4A7D',
  },
} as const;
```

---

## 付録: CPU敵データ（一部抜粋）

```typescript
// src/data/enemies.ts

import { EnemyDef } from '../types';

/**
 * 闘技場の敵キメラデータ
 * ランク1-10 x 各3体 = 30体
 *
 * 命名パターン: [形容詞] + [動物名]（カタカナ化）
 * ステータス: ランクに応じてリニアに上昇
 *
 * ランク1: power 60-80
 * ランク2: power 80-120
 * ...
 * ランク10: power 500-600
 */

export const ENEMY_DATA: EnemyDef[] = [
  // --- ランク1 (入門) ---
  {
    id: 'enemy_r1_1',
    name: 'プチスライム',
    slotDefIds: { head: 'head_kraken_0', body: 'body_kraken_0', legs: 'legs_kraken_0' },
    totalStats: { atk: 16, hp: 45, spd: 15 },
    emoji: '🐙🫧🦑',
    arenaRank: 1,
  },
  {
    id: 'enemy_r1_2',
    name: 'コヒツジ',
    slotDefIds: { head: 'head_phoenix_0', body: 'body_phoenix_0', legs: 'legs_phoenix_0' },
    totalStats: { atk: 18, hp: 23, spd: 34 },
    emoji: '🐦🪶🐤',
    arenaRank: 1,
  },
  {
    id: 'enemy_r1_3',
    name: 'ワカトカゲ',
    slotDefIds: { head: 'head_dragon_0', body: 'body_dragon_0', legs: 'legs_dragon_0' },
    totalStats: { atk: 25, hp: 30, spd: 18 },
    emoji: '🐲🟤🦎',
    arenaRank: 1,
  },

  // --- ランク2 ---
  {
    id: 'enemy_r2_1',
    name: 'グリーンコブラ',
    slotDefIds: { head: 'head_dragon_1', body: 'body_kraken_0', legs: 'legs_phoenix_0' },
    totalStats: { atk: 30, hp: 40, spd: 30 },
    emoji: '🐲🫧🐤',
    arenaRank: 2,
  },
  {
    id: 'enemy_r2_2',
    name: 'アオサギ',
    slotDefIds: { head: 'head_phoenix_1', body: 'body_phoenix_0', legs: 'legs_kraken_0' },
    totalStats: { atk: 25, hp: 28, spd: 42 },
    emoji: '🦅🪶🦑',
    arenaRank: 2,
  },
  {
    id: 'enemy_r2_3',
    name: 'ツノイモリ',
    slotDefIds: { head: 'head_kraken_1', body: 'body_dragon_0', legs: 'legs_dragon_0' },
    totalStats: { atk: 28, hp: 43, spd: 22 },
    emoji: '🐙🟤🦎',
    arenaRank: 2,
  },

  // --- ランク5 (中級) ---
  {
    id: 'enemy_r5_1',
    name: 'フレイムバロン',
    slotDefIds: { head: 'head_dragon_2', body: 'body_dragon_2', legs: 'legs_phoenix_2' },
    totalStats: { atk: 68, hp: 83, spd: 68 },
    emoji: '🐉🔶🦶',
    arenaRank: 5,
  },
  {
    id: 'enemy_r5_2',
    name: 'アビスガード',
    slotDefIds: { head: 'head_kraken_2', body: 'body_kraken_2', legs: 'legs_kraken_2' },
    totalStats: { atk: 38, hp: 135, spd: 44 },
    emoji: '🦑🌊🐙',
    arenaRank: 5,
  },
  {
    id: 'enemy_r5_3',
    name: 'サンダーホーク',
    slotDefIds: { head: 'head_phoenix_2', body: 'body_phoenix_2', legs: 'legs_phoenix_2' },
    totalStats: { atk: 54, hp: 61, spd: 96 },
    emoji: '🦅🔥🦶',
    arenaRank: 5,
  },

  // --- ランク10 (最高) ---
  {
    id: 'enemy_r10_1',
    name: '覇竜カイザー',
    slotDefIds: { head: 'head_dragon_4', body: 'body_dragon_4', legs: 'legs_dragon_4' },
    totalStats: { atk: 200, hp: 240, spd: 136 },
    emoji: '🐉🟠🐾',
    arenaRank: 10,
  },
  {
    id: 'enemy_r10_2',
    name: '深淵王ネプチューン',
    slotDefIds: { head: 'head_kraken_4', body: 'body_kraken_4', legs: 'legs_kraken_4' },
    totalStats: { atk: 120, hp: 360, spd: 115 },
    emoji: '🦑🌊🐙',
    arenaRank: 10,
  },
  {
    id: 'enemy_r10_3',
    name: '永劫鳥アマテラス',
    slotDefIds: { head: 'head_phoenix_4', body: 'body_phoenix_4', legs: 'legs_phoenix_4' },
    totalStats: { atk: 140, hp: 160, spd: 260 },
    emoji: '🔥🔥💨',
    arenaRank: 10,
  },

  // ※ 残り21体（ランク3,4,6,7,8,9 x 各3体）は同パターンで定義
  // ステータスはランクごとに線形補間:
  // power = 60 + (rank - 1) * 55  ± 20% のランダム振れ幅
];
```

---

## 付録: ゲームフロー図

```
┌──────────┐
│ タイトル画面 │
│  (index)  │
└─────┬────┘
      │ はじめる
      ▼
┌──────────┐   装備変更/マージ   ┌──────────┐
│ メイン画面  │◄─────────────►│ キメラ設計  │
│  (main)   │               │ (同画面内)  │
└─────┬────┘               └──────────┘
      │
  ┌───┼───────┐
  │   │       │
  ▼   ▼       ▼
┌────┐┌────┐┌────┐
│闘技場││図鑑 ││ショップ│
│arena││codex││shop │
└──┬─┘└────┘└────┘
   │
   ▼
┌──────────┐
│ 対戦相手選択│
└─────┬────┘
      │ 挑戦する
      ▼
┌──────────┐
│ バトル演出  │ ← 3秒オート戦闘
│(BattleAnim)│
└─────┬────┘
      │
      ▼
┌──────────┐
│ 結果表示   │ ← 報酬受取 / 広告2倍 / シェア
│(ResultModal)│
└─────┬────┘
      │
      ▼ 戻る
┌──────────┐
│ メイン画面  │ ← 新部位がインベントリに追加済み → マージ → もっと強く！
│  (main)   │
└──────────┘
```

**コアループ**:
```
部位入手 → マージで強化 → キメラ設計 → 闘技場で戦う → 勝利報酬で部位入手 → (繰り返し)
```

このループが「Suika Gameのマージ中毒性」+「Sporeのパーツ組み合わせ創造性」+「Marvel Snapの3秒決着高速バトル」の三位一体で回転する。

---

## 付録: 初回チュートリアルフロー

```
1. 初回起動
   → 「ようこそ！キメラを作ろう！」

2. 部位3枚を自動付与
   → head_dragon_0, body_phoenix_0, legs_kraken_0（全Common）
   → 「これがあなたの最初の部位です」

3. 装備チュートリアル（強制誘導）
   → 頭部位をHEADスロットにドラッグ（ハイライト＋矢印で誘導）
   → 胴部位をBODYスロットにドラッグ
   → 脚部位をLEGSスロットにドラッグ
   → 「キメラが完成しました！名前をつけましょう」

4. キメラ命名
   → テキスト入力（デフォルト「キメラ」、最大10文字）

5. 初戦チュートリアル
   → 闘技場に自動遷移
   → 最弱のenemy_r1_1「プチスライム」と強制対戦
   → 必ず勝てるバランス（チュートリアル戦のみダメージ+50%補正）
   → 「おめでとう！初勝利です！」

6. 報酬受取
   → 勝利報酬: head_kraken_0（Common）+ 100コイン
   → 「同じ種類の部位を2つ合成すると、もっと強い部位に進化します！」

7. マージチュートリアル
   → 初期付与のhead_dragon_0 + 報酬のhead_kraken_0（両方headのCommon）
   → マージ台にドラッグ誘導
   → 合成成功 → Uncommon頭部位入手
   → 「すごい！レアな部位が生まれました！」

8. チュートリアル完了
   → 「準備完了！闘技場で最強のキメラを目指そう！」
   → tutorialCompleted = true
   → 自由行動開始
```

---

*設計書ここまで。この文書に記載された仕様で実装を開始してください。追加質問は不要です。*
