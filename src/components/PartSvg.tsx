/**
 * SVG renderer for chimera parts based on svgKey
 * Replaces all emoji display for PartDef.
 * svgKey format: "{type}_{species}_{tier}" e.g. "head_dragon_1"
 */
import React from 'react';
import Svg, { Circle, Path, Rect, G, Ellipse } from 'react-native-svg';

interface PartSvgProps {
  svgKey: string;
  size?: number;
  color?: string;
}

// Color palettes per species, indexed by tier (1-5)
const DRAGON_COLORS = ['#8BC34A', '#66BB6A', '#FF7043', '#E64A19', '#FFD700'];
const PHOENIX_COLORS = ['#FFB74D', '#FF9800', '#F44336', '#D50000', '#FF6D00'];
const KRAKEN_COLORS = ['#81D4FA', '#42A5F5', '#7E57C2', '#4527A0', '#00E5FF'];

function getColors(species: string, tier: number): { primary: string; secondary: string; accent: string } {
  const t = Math.max(0, Math.min(4, tier - 1));
  if (species === 'dragon') {
    return { primary: DRAGON_COLORS[t], secondary: '#5D4037', accent: '#FFC107' };
  }
  if (species === 'phoenix') {
    return { primary: PHOENIX_COLORS[t], secondary: '#BF360C', accent: '#FFEB3B' };
  }
  // kraken
  return { primary: KRAKEN_COLORS[t], secondary: '#1A237E', accent: '#B2FF59' };
}

export const PartSvg: React.FC<PartSvgProps> = ({ svgKey, size = 28, color }) => {
  // Parse svgKey: "head_dragon_1" -> type=head, species=dragon, tier=1
  const parts = svgKey.split('_');
  if (parts.length < 3) return null;

  const type = parts[0]; // head, body, legs
  const species = parts[1]; // dragon, phoenix, kraken
  const tier = parseInt(parts[2], 10) || 1;
  const c = getColors(species, tier);
  const fill = color || c.primary;

  // -- HEAD --
  if (type === 'head') {
    if (species === 'dragon') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="ドラゴンの頭">
          <Path d="M16 4C10 4 6 9 6 15c0 4 2 7 5 9h10c3-2 5-5 5-9 0-6-4-11-10-11z" fill={fill} />
          <Circle cx="11" cy="14" r="2" fill="#FFF" />
          <Circle cx="21" cy="14" r="2" fill="#FFF" />
          <Circle cx="11" cy="14.5" r="1" fill="#333" />
          <Circle cx="21" cy="14.5" r="1" fill="#333" />
          {tier >= 2 && <Path d="M10 4l-3-3M22 4l3-3" stroke={c.accent} strokeWidth="2" strokeLinecap="round" />}
          {tier >= 3 && <Path d="M16 20l-2 3h4l-2-3z" fill="#FF5722" />}
          {tier >= 4 && <Path d="M6 12l-3-1M26 12l3-1" stroke={c.accent} strokeWidth="1.5" />}
          {tier >= 5 && <Circle cx="16" cy="6" r="2" fill={c.accent} />}
        </Svg>
      );
    }
    if (species === 'phoenix') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="フェニックスの頭">
          <Path d="M16 6c-5 0-8 4-8 8 0 3 2 6 4 7h8c2-1 4-4 4-7 0-4-3-8-8-8z" fill={fill} />
          <Path d="M16 2l-2 4h4l-2-4z" fill={c.accent} />
          <Circle cx="12" cy="14" r="1.5" fill="#FFF" />
          <Circle cx="20" cy="14" r="1.5" fill="#FFF" />
          <Circle cx="12" cy="14.3" r="0.8" fill="#333" />
          <Circle cx="20" cy="14.3" r="0.8" fill="#333" />
          <Path d="M14 18l2 1 2-1" stroke={c.secondary} strokeWidth="1" fill="none" />
          {tier >= 3 && <Path d="M10 6l-4-3M22 6l4-3" stroke={c.accent} strokeWidth="1.5" />}
          {tier >= 4 && <Path d="M16 2l0-2" stroke={c.accent} strokeWidth="2" />}
          {tier >= 5 && <Path d="M8 8l-3-1M24 8l3-1" stroke={c.accent} strokeWidth="1.5" />}
        </Svg>
      );
    }
    // kraken
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="クラーケンの頭">
        <Ellipse cx="16" cy="14" rx="10" ry="8" fill={fill} />
        <Circle cx="12" cy="12" r="2.5" fill="#FFF" />
        <Circle cx="20" cy="12" r="2.5" fill="#FFF" />
        <Circle cx="12" cy="12.5" r="1.2" fill="#1A237E" />
        <Circle cx="20" cy="12.5" r="1.2" fill="#1A237E" />
        {tier >= 2 && <Path d="M10 20c-2 2-4 3-5 2M22 20c2 2 4 3 5 2" stroke={fill} strokeWidth="2" fill="none" />}
        {tier >= 4 && <Circle cx="16" cy="6" r="1.5" fill={c.accent} />}
        {tier >= 5 && <Path d="M8 18c-3 1-5 3-5 2M24 18c3 1 5 3 5 2" stroke={fill} strokeWidth="1.5" fill="none" />}
      </Svg>
    );
  }

  // -- BODY --
  if (type === 'body') {
    if (species === 'dragon') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="ドラゴンの胴体">
          <Path d="M8 4h16v20c0 2-3 4-8 4s-8-2-8-4V4z" fill={fill} />
          <Path d="M10 8h12v3H10z" fill={c.secondary} opacity="0.3" />
          <Path d="M10 14h12v3H10z" fill={c.secondary} opacity="0.3" />
          {tier >= 2 && <Path d="M24 10l4-2v8l-4-2" fill={fill} opacity="0.7" />}
          {tier >= 3 && <Path d="M8 10l-4-2v8l4-2" fill={fill} opacity="0.7" />}
          {tier >= 4 && <Path d="M14 6h4v2h-4z" fill={c.accent} />}
          {tier >= 5 && <Circle cx="16" cy="16" r="3" fill={c.accent} opacity="0.5" />}
        </Svg>
      );
    }
    if (species === 'phoenix') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="フェニックスの胴体">
          <Ellipse cx="16" cy="16" rx="8" ry="12" fill={fill} />
          <Path d="M8 12c-4-2-6 0-5 3s4 3 5 2" fill={fill} opacity="0.8" />
          <Path d="M24 12c4-2 6 0 5 3s-4 3-5 2" fill={fill} opacity="0.8" />
          {tier >= 3 && <Path d="M6 10c-5-3-7 0-6 4s5 4 6 3" fill={c.accent} opacity="0.4" />}
          {tier >= 3 && <Path d="M26 10c5-3 7 0 6 4s-5 4-6 3" fill={c.accent} opacity="0.4" />}
          {tier >= 5 && <Path d="M12 8h8v2h-8z" fill={c.accent} opacity="0.6" />}
        </Svg>
      );
    }
    // kraken
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="クラーケンの胴体">
        <Ellipse cx="16" cy="14" rx="10" ry="12" fill={fill} />
        <Path d="M10 22c-1 4-2 6-1 7M14 24c0 4-1 6 0 7M18 24c0 4 1 6 0 7M22 22c1 4 2 6 1 7" stroke={fill} strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {tier >= 3 && <Circle cx="16" cy="12" r="3" fill={c.accent} opacity="0.3" />}
        {tier >= 5 && <Path d="M8 20c-2 3-3 5-2 6M24 20c2 3 3 5 2 6" stroke={fill} strokeWidth="2" fill="none" />}
      </Svg>
    );
  }

  // -- LEGS --
  if (type === 'legs') {
    if (species === 'dragon') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="ドラゴンの脚">
          <Path d="M8 4h4v18l-4 4v-4l-2 2v-6l2-2V4z" fill={fill} />
          <Path d="M20 4h4v18l-4 4v-4l-2 2v-6l2-2V4z" fill={fill} />
          <Path d="M4 26l2-2 2 2M22 26l2-2 2 2" stroke={c.secondary} strokeWidth="1.5" fill="none" />
          {tier >= 3 && <Path d="M6 24l-2 2M26 24l2 2" stroke={fill} strokeWidth="2" />}
          {tier >= 5 && <Path d="M10 4h12v3H10z" fill={c.accent} opacity="0.4" />}
        </Svg>
      );
    }
    if (species === 'phoenix') {
      return (
        <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="フェニックスの脚">
          <Path d="M10 4v16l-4 6h2l3-4 3 4h2l-4-6V4h-2z" fill={fill} />
          <Path d="M20 4v16l-4 6h2l3-4 3 4h2l-4-6V4h-2z" fill={fill} />
          {tier >= 3 && <Path d="M8 22l-2 4M24 22l2 4" stroke={c.accent} strokeWidth="1.5" />}
          {tier >= 5 && <Path d="M10 6h12v2H10z" fill={c.accent} opacity="0.5" />}
        </Svg>
      );
    }
    // kraken
    return (
      <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="クラーケンの脚">
        <Path d="M6 4c0 6-2 14 0 18s4 4 4 6" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M13 4c0 6-1 14 0 18s3 4 3 6" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M20 4c0 6 1 14 0 18s-3 4-3 6" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M26 4c0 6 2 14 0 18s-4 4-4 6" stroke={fill} strokeWidth="3" fill="none" strokeLinecap="round" />
        {tier >= 3 && <Circle cx="8" cy="26" r="2" fill={c.accent} opacity="0.5" />}
        {tier >= 3 && <Circle cx="24" cy="26" r="2" fill={c.accent} opacity="0.5" />}
        {tier >= 5 && <Circle cx="16" cy="26" r="2" fill={c.accent} opacity="0.7" />}
      </Svg>
    );
  }

  return null;
};

/**
 * Renders a '?' placeholder when no part is equipped
 */
export const PartPlaceholder: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" accessibilityLabel="未装備">
    <Circle cx="16" cy="16" r="12" fill="none" stroke="#666" strokeWidth="2" strokeDasharray="4 3" />
    <Path
      d="M13 11a4 4 0 0 1 6 3c0 2-3 2-3 4"
      stroke="#666"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    <Circle cx="16" cy="22" r="1.2" fill="#666" />
  </Svg>
);
