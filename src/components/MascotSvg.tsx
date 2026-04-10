/**
 * 合成キメラ マスコット: キメラベビー「キメちゃん」
 * ドラゴン翼+猫耳+鳥の尾を持つかわいい合成獣
 * 1.5頭身SD / 目は頭部40% / 4表情
 */
import React from 'react';
import Svg, {
  Circle, Ellipse, Path, G, Defs, RadialGradient, LinearGradient, Stop,
} from 'react-native-svg';

type ChimeraExpression = 'happy' | 'fierce' | 'curious' | 'sleepy';

interface MascotSvgProps {
  size?: number;
  expression?: ChimeraExpression;
}

export const MascotSvg: React.FC<MascotSvgProps> = ({ size = 120, expression = 'happy' }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      accessibilityLabel="キメちゃん（キメラマスコット）"
    >
      <Defs>
        <RadialGradient id="bodyGrad" cx="45%" cy="35%" r="55%">
          <Stop offset="0%" stopColor="#E1BEE7" />
          <Stop offset="50%" stopColor="#CE93D8" />
          <Stop offset="100%" stopColor="#AB47BC" />
        </RadialGradient>
        <LinearGradient id="wingGrad" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor="#7C4DFF" />
          <Stop offset="50%" stopColor="#B388FF" />
          <Stop offset="100%" stopColor="#E040FB" />
        </LinearGradient>
        <LinearGradient id="tailGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#AB47BC" />
          <Stop offset="50%" stopColor="#FF6D00" />
          <Stop offset="100%" stopColor="#FFD93D" />
        </LinearGradient>
      </Defs>

      {/* Shadow */}
      <Ellipse cx="60" cy="110" rx="25" ry="5" fill="#00000020" />

      {/* Tail (peacock-like feathers) */}
      <G>
        <Path d="M30 80 Q10 70 8 55" stroke="url(#tailGrad)" strokeWidth="4" fill="none" strokeLinecap="round" />
        <Path d="M30 80 Q15 75 15 60" stroke="url(#tailGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <Path d="M30 80 Q20 80 22 65" stroke="url(#tailGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
        {/* Feather eyes */}
        <Circle cx="8" cy="54" r="4" fill="#FFD93D" />
        <Circle cx="8" cy="54" r="2" fill="#1A237E" />
        <Circle cx="15" cy="59" r="3.5" fill="#FF6D00" />
        <Circle cx="15" cy="59" r="1.5" fill="#1A237E" />
        <Circle cx="22" cy="64" r="3" fill="#E040FB" />
        <Circle cx="22" cy="64" r="1.5" fill="#1A237E" />
      </G>

      {/* Wings */}
      <G>
        {/* Left wing */}
        <Path d="M40 55 L18 35 L22 48 L12 30 L20 45 L28 50 Z" fill="url(#wingGrad)" opacity={0.8} />
        {/* Right wing */}
        <Path d="M80 55 L102 35 L98 48 L108 30 L100 45 L92 50 Z" fill="url(#wingGrad)" opacity={0.8} />
      </G>

      {/* Body */}
      <Ellipse cx="60" cy="78" rx="22" ry="18" fill="url(#bodyGrad)" />

      {/* Belly */}
      <Ellipse cx="60" cy="82" rx="14" ry="10" fill="#F3E5F5" opacity={0.7} />

      {/* Head */}
      <Ellipse cx="60" cy="45" rx="24" ry="22" fill="url(#bodyGrad)" />

      {/* Cat ears */}
      <Path d="M40 28 L36 10 L48 22 Z" fill="#CE93D8" />
      <Path d="M42 26 L38 14 L47 23 Z" fill="#FFB3B3" />
      <Path d="M80 28 L84 10 L72 22 Z" fill="#CE93D8" />
      <Path d="M78 26 L82 14 L73 23 Z" fill="#FFB3B3" />

      {/* Tiny horn */}
      <Path d="M60 24 L58 14 L62 14 Z" fill="#FFD93D" />

      {/* Eyes */}
      {expression === 'sleepy' ? (
        <G>
          <Path d="M46 42 Q52 38 58 42" stroke="#4A148C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <Path d="M62 42 Q68 38 74 42" stroke="#4A148C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </G>
      ) : (
        <G>
          <Ellipse cx="50" cy="42" rx={expression === 'curious' ? 8 : 7} ry={expression === 'fierce' ? 6 : 8} fill="#FFFFFF" />
          <Ellipse cx="70" cy="42" rx={expression === 'curious' ? 8 : 7} ry={expression === 'fierce' ? 6 : 8} fill="#FFFFFF" />
          {/* Heterochromia iris */}
          <Circle cx="51" cy="42" r="4.5" fill={expression === 'fierce' ? '#FF1744' : '#7C4DFF'} />
          <Circle cx="71" cy="42" r="4.5" fill={expression === 'fierce' ? '#FF6D00' : '#FF6D00'} />
          <Circle cx="52" cy="41" r="2.5" fill="#1A1A2E" />
          <Circle cx="72" cy="41" r="2.5" fill="#1A1A2E" />
          <Circle cx="49" cy="39" r="2" fill="#FFFFFF" />
          <Circle cx="69" cy="39" r="2" fill="#FFFFFF" />
        </G>
      )}

      {/* Nose */}
      <Ellipse cx="60" cy="50" rx="2.5" ry="2" fill="#FF80AB" />

      {/* Mouth */}
      {expression === 'happy' ? (
        <Path d="M54 54 Q60 60 66 54" stroke="#4A148C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      ) : expression === 'fierce' ? (
        <G>
          <Path d="M52 54 Q60 58 68 54" stroke="#4A148C" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Fangs */}
          <Path d="M54 54 L53 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
          <Path d="M66 54 L67 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </G>
      ) : expression === 'curious' ? (
        <Ellipse cx="60" cy="55" rx="3" ry="3.5" fill="#4A148C" />
      ) : (
        <Path d="M56 55 L64 55" stroke="#4A148C" strokeWidth="1.5" strokeLinecap="round" />
      )}

      {/* Cheek blush */}
      <Ellipse cx="40" cy="50" rx="5" ry="3" fill="#FF80AB" opacity={0.4} />
      <Ellipse cx="80" cy="50" rx="5" ry="3" fill="#FF80AB" opacity={0.4} />

      {/* Paws */}
      <Ellipse cx="46" cy="95" rx="8" ry="5" fill="#CE93D8" />
      <Ellipse cx="74" cy="95" rx="8" ry="5" fill="#CE93D8" />
      {/* Toe beans */}
      <Circle cx="42" cy="94" r="2" fill="#F3E5F5" />
      <Circle cx="46" cy="93" r="2" fill="#F3E5F5" />
      <Circle cx="50" cy="94" r="2" fill="#F3E5F5" />
      <Circle cx="70" cy="94" r="2" fill="#F3E5F5" />
      <Circle cx="74" cy="93" r="2" fill="#F3E5F5" />
      <Circle cx="78" cy="94" r="2" fill="#F3E5F5" />
    </Svg>
  );
};
