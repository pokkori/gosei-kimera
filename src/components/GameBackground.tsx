/**
 * 合成キメラ ゲーム背景: 錬成メッシュグラデーション
 */
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  Rect, Defs, RadialGradient, Stop, LinearGradient, Circle,
} from 'react-native-svg';

const { width: W, height: H } = Dimensions.get('window');

interface GameBackgroundProps {
  fever?: boolean;
}

export const GameBackground: React.FC<GameBackgroundProps> = ({ fever = false }) => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          <LinearGradient id="baseBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor="#0D0D1A" />
            <Stop offset="50%" stopColor={fever ? '#2A0845' : '#120D20'} />
            <Stop offset="100%" stopColor="#080812" />
          </LinearGradient>
          <RadialGradient id="purpleOrb" cx="35%" cy="30%" r="40%">
            <Stop offset="0%" stopColor="#7C4DFF" stopOpacity={fever ? '0.25' : '0.12'} />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="orangeOrb" cx="70%" cy="65%" r="35%">
            <Stop offset="0%" stopColor="#FF6D00" stopOpacity={fever ? '0.2' : '0.08'} />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id="goldOrb" cx="50%" cy="50%" r="30%">
            <Stop offset="0%" stopColor="#FFD93D" stopOpacity="0.06" />
            <Stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </RadialGradient>
        </Defs>

        <Rect x="0" y="0" width={W} height={H} fill="url(#baseBg)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#purpleOrb)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#orangeOrb)" />
        <Rect x="0" y="0" width={W} height={H} fill="url(#goldOrb)" />

        {/* Alchemy symbols floating */}
        <Circle cx={W * 0.15} cy={H * 0.2} r="5" fill="#7C4DFF" opacity={0.08} />
        <Circle cx={W * 0.82} cy={H * 0.35} r="4" fill="#FF6D00" opacity={0.08} />
        <Circle cx={W * 0.45} cy={H * 0.85} r="6" fill="#E040FB" opacity={0.06} />
        <Circle cx={W * 0.7} cy={H * 0.1} r="3" fill="#FFD93D" opacity={0.08} />
      </Svg>
    </View>
  );
};
