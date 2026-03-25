import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { COLORS } from '../src/constants/colors';
import { useGameStore } from '../src/store/gameStore';
import { IconSvg } from '../src/components/IconSvg';

export default function TitleScreen() {
  const router = useRouter();
  const tutorialCompleted = useGameStore(s => s.tutorialCompleted);
  const logoScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    buttonOpacity.value = withDelay(800, withSpring(1));
  }, [logoScale, buttonOpacity]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleStart = () => {
    router.replace('/main');
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoIconBox} accessibilityLabel="合成キメラ ロゴ">
          <IconSvg name="dragon" size={80} />
        </View>
        <Text style={styles.title}>{'合成キメラ'}</Text>
        <Text style={styles.subtitle}>CHIMERA FORGE</Text>
      </Animated.View>

      <Animated.View style={[styles.buttons, buttonStyle]}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={handleStart}
          accessibilityLabel="ゲームを始める"
          accessibilityRole="button"
        >
          <View style={styles.startButtonInner}>
            <IconSvg name="play" size={22} color={COLORS.text.primary} />
            <Text style={styles.startButtonText}>{'はじめる'}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.version}>v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logoIconBox: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: COLORS.text.primary,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
  },
  subtitle: {
    color: COLORS.ui.accentLight,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: 4,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  startButton: {
    backgroundColor: COLORS.ui.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    minHeight: 44,
  },
  startButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  startButtonText: {
    color: COLORS.text.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  version: {
    color: COLORS.text.muted,
    fontSize: 12,
    position: 'absolute',
    bottom: 32,
  },
});
