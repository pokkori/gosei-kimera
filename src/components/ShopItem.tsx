import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { COLORS } from '../constants/colors';
import { IconSvg } from './IconSvg';

type IconName = 'gift' | 'dice' | 'gem' | 'forbidden' | 'box' | 'coin' | 'shop' | 'star' | 'trophy';

interface Props {
  iconName: IconName;
  title: string;
  description: string;
  price: string;
  onBuy: () => void;
  disabled?: boolean;
}

export const ShopItem: React.FC<Props> = ({ iconName, title, description, price, onBuy, disabled }) => {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    if (disabled) return;
    // 購入ボタンタップ時: scale 1→0.95→1 (withSpring damping:15, stiffness:400)
    scale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 400 }),
      withSpring(1.0, { damping: 15, stiffness: 400 }),
    );
    onBuy();
  }, [disabled, onBuy, scale]);

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.card}>
      <IconSvg name={iconName} size={36} />
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.desc}>{description}</Text>
      </View>
      <Animated.View style={[buttonAnimStyle, disabled && styles.buttonDisabledWrapper]}>
        <Pressable
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={handlePress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel={`${title}を購入する。価格: ${price}`}
          accessibilityState={{ disabled: !!disabled }}
        >
          <Text style={styles.buttonText}>{price}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg.surface, borderRadius: 12, padding: 12,
    gap: 12,
  },
  info: { flex: 1 },
  title: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
  desc: { color: COLORS.text.secondary, fontSize: 11, marginTop: 2 },
  button: {
    backgroundColor: COLORS.ui.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: { backgroundColor: COLORS.ui.accent },
  buttonDisabledWrapper: { opacity: 0.5 },
  buttonText: { color: COLORS.text.primary, fontSize: 13, fontWeight: '700' },
});
