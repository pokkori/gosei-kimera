import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/colors';

interface Props {
  icon: string;
  title: string;
  description: string;
  price: string;
  onBuy: () => void;
  disabled?: boolean;
}

export const ShopItem: React.FC<Props> = ({ icon, title, description, price, onBuy, disabled }) => (
  <View style={styles.card}>
    <Text style={styles.icon}>{icon}</Text>
    <View style={styles.info}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{description}</Text>
    </View>
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onBuy}
      disabled={disabled}
    >
      <Text style={styles.buttonText}>{price}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.bg.surface, borderRadius: 12, padding: 12,
    gap: 12,
  },
  icon: { fontSize: 32 },
  info: { flex: 1 },
  title: { color: COLORS.text.primary, fontSize: 14, fontWeight: '700' },
  desc: { color: COLORS.text.secondary, fontSize: 11, marginTop: 2 },
  button: {
    backgroundColor: COLORS.ui.accent, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: COLORS.text.primary, fontSize: 13, fontWeight: '700' },
});
