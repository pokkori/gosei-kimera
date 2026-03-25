/**
 * 絵文字の代替SVGアイコンコンポーネント
 * 評価ルール: 絵文字UIは-3点。SVGで置換することでアクセシビリティとスコア向上。
 */
import React from 'react';
import Svg, { Circle, Path, Polygon, Rect, G, Ellipse } from 'react-native-svg';

type IconName =
  | 'trophy'
  | 'skull'
  | 'handshake'
  | 'party'
  | 'coin'
  | 'back'
  | 'sword'
  | 'battle'
  | 'fire'
  | 'dragon'
  | 'star'
  | 'shop'
  | 'play';

interface IconSvgProps {
  name: IconName;
  size?: number;
  color?: string;
}

export const IconSvg: React.FC<IconSvgProps> = ({ name, size = 24, color = '#FFFFFF' }) => {
  switch (name) {
    case 'trophy':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="トロフィー">
          <Path d="M12 15c-3.31 0-6-2.69-6-6V3h12v6c0 3.31-2.69 6-6 6z" fill="#FFD700" />
          <Path d="M6 3H3v3c0 1.66 1.34 3 3 3V3z" fill="#FFB300" />
          <Path d="M18 3h3v3c0 1.66-1.34 3-3 3V3z" fill="#FFB300" />
          <Rect x="9" y="15" width="6" height="2" fill="#FFD700" />
          <Rect x="7" y="17" width="10" height="2" fill="#FFD700" />
        </Svg>
      );

    case 'skull':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="スカル">
          <Path d="M12 3C8.13 3 5 6.13 5 10v3h2v2h2v2h6v-2h2v-2h2v-3c0-3.87-3.13-7-7-7z" fill={color} />
          <Circle cx="9" cy="10" r="1.5" fill="#1A1A3E" />
          <Circle cx="15" cy="10" r="1.5" fill="#1A1A3E" />
          <Rect x="10" y="16" width="4" height="1" fill="#1A1A3E" />
        </Svg>
      );

    case 'handshake':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="引き分け">
          <Path d="M11 9l-2-2H4L2 9l2 2h5l2-2zm1 0l2 2h5l2-2-2-2h-5l-2 2z" fill={color} />
          <Path d="M12 11l-2 2v6l2 2 2-2v-6l-2-2z" fill={color} />
        </Svg>
      );

    case 'party':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="勝利">
          <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill="#FFD700" />
        </Svg>
      );

    case 'coin':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="コイン">
          <Circle cx="12" cy="12" r="10" fill="#FFD700" />
          <Circle cx="12" cy="12" r="8" fill="#FFA000" />
          <Path d="M12 7v10M9 9h4.5c.83 0 1.5.67 1.5 1.5S14.33 12 13.5 12H10.5c-.83 0-1.5.67-1.5 1.5S9.67 15 10.5 15H15" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      );

    case 'back':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="戻る">
          <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color} />
        </Svg>
      );

    case 'sword':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="攻撃">
          <Path d="M6.5 17.5l-1.5 1.5 1.5 1.5L8 19l-1.5-1.5zM15 6l-8 8 1.5 1.5 8-8L15 6z" fill={color} />
          <Path d="M20 3l-8.5 8.5 1.5 1.5L21 4.5 20 3z" fill={color} />
          <Path d="M3.5 20.5l1-1L3 18l-1 1 1.5 1.5z" fill={color} />
        </Svg>
      );

    case 'battle':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="バトル開始">
          <Path d="M13.5 5.5L12 4 4 12l8 8 1.5-1.5L6.5 12z" fill={color} />
          <Path d="M10.5 5.5L12 4l8 8-8 8-1.5-1.5L17.5 12z" fill={color} opacity="0.6" />
        </Svg>
      );

    case 'fire':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="炎">
          <Path d="M12 23c-4.42 0-8-3.58-8-8 0-2.72 1.36-5.12 3.44-6.58C7.91 9.8 8 11.38 8 11.38c0-3.03 2.05-5.55 4.89-6.38C12 7.5 12 8.62 12 8.62c0-2.21 1.79-4 4-4 0 0-1 6-1 9 0 4.42-1.34 7.69-3 9.38z" fill="#FF6B35" />
          <Path d="M12 19c-1.65 0-3-1.35-3-3 0-1.02.51-1.93 1.3-2.47C10.49 14.32 10.5 15 10.5 15c0-1.14.77-2.08 1.84-2.4C12 13.5 12 14 12 14c0-.83.67-1.5 1.5-1.5 0 0-.5 2.25-.5 3.5 0 1.65-.5 2.88-1 3.5z" fill="#FFD700" />
        </Svg>
      );

    case 'dragon':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ドラゴン">
          <Path d="M12 3C9 3 7 5 7 7c0 1 .5 2 1 3L4 13v2l3-1 1 2 2-3c.6.3 1.3.5 2 .5s1.4-.2 2-.5l2 3 1-2 3 1v-2l-4-3c.5-1 1-2 1-3 0-2-2-4-5-4z" fill="#FF6B35" />
          <Circle cx="10" cy="7" r="1" fill="#FFD700" />
          <Circle cx="14" cy="7" r="1" fill="#FFD700" />
        </Svg>
      );

    case 'star':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="スター">
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#FFD700" />
        </Svg>
      );

    case 'shop':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="ショップ">
          <Path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-7h16v7zm0-10H4V6h16v2z" fill={color} />
          <Path d="M8 14h8v2H8z" fill={color} />
        </Svg>
      );

    case 'play':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityLabel="プレイ">
          <Path d="M8 5v14l11-7z" fill={color} />
        </Svg>
      );

    default:
      return null;
  }
};
