import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  FadeInDown,
} from 'react-native-reanimated';
import { COLORS } from '../src/constants/colors';
import { useGameStore } from '../src/store/gameStore';
import { IconSvg } from '../src/components/IconSvg';
import WelcomeBackModal, { checkWelcomeBack } from '../src/components/WelcomeBackModal';

export default function TitleScreen() {
  const router = useRouter();
  const tutorialCompleted = useGameStore(s => s.tutorialCompleted);
  const logoScale = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const [welcomeVisible, setWelcomeVisible] = useState(false);
  const [welcomeResult, setWelcomeResult] = useState<{ shouldShow: boolean; hoursAway: number; bonusCoins: number; message: string }>({ shouldShow: false, hoursAway: 0, bonusCoins: 0, message: '' });

  useEffect(() => {
    logoScale.value = withSpring(1, { damping: 8, stiffness: 100 });
    buttonOpacity.value = withDelay(800, withSpring(1));
    checkWelcomeBack().then((r) => { if (r.shouldShow) { setWelcomeResult(r); setWelcomeVisible(true); } });
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
    <LinearGradient colors={['#0F0F1A', '#1A0A2E', '#2D1B4E']} style={styles.container}>
      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <View style={styles.logoIconBox} accessibilityLabel="合成キメラ ロゴ">
          <IconSvg name="dragon" size={80} />
        </View>
        <Text style={styles.title}>{'合成キメラ'}</Text>
        <Text style={styles.subtitle}>CHIMERA FORGE</Text>
      </Animated.View>

      <Animated.View style={[styles.buttons, buttonStyle]}>
        <Pressable
          onPress={handleStart}
          onPressIn={() => {}}
          style={({ pressed }) => [styles.startButton, pressed && styles.startButtonPressed]}
          accessibilityLabel="ゲームを始める"
          accessibilityRole="button"
        >
          <LinearGradient
            colors={['#7C4DFF', '#651FFF', '#AA00FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <IconSvg name="play" size={22} color={COLORS.text.primary} />
            <Text style={styles.startButtonText}>{'はじめる'}</Text>
          </LinearGradient>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(1200).duration(600)}>
        <Text style={styles.version}>v1.0.0</Text>
      </Animated.View>
      <WelcomeBackModal
        visible={welcomeVisible}
        result={welcomeResult}
        onClose={() => setWelcomeVisible(false)}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    color: '#F1F5F9',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: '#7C4DFF',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    color: COLORS.ui.accentLight,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: 4,
    textShadowColor: '#B388FF',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 0 },
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  startButton: {
    borderRadius: 16,
    overflow: 'hidden',
    minHeight: 44,
    shadowColor: '#7C4DFF',
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  startButtonPressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.9,
  },
  startButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  startButtonText: {
    color: '#F1F5F9',
    fontSize: 20,
    fontWeight: '700',
  },
  version: {
    color: COLORS.text.muted,
    fontSize: 12,
    marginTop: 48,
  },
});
