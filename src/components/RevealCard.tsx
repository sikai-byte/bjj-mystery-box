import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from '../types';
import { colors, typeColor, typeEmoji, typeLabel } from '../theme';

export function RevealCard({ card }: { card: Card }) {
  const color = typeColor[card.type];
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>
          {typeEmoji[card.type]} {typeLabel[card.type]}
        </Text>
      </View>
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.description}>{card.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 260,
    borderRadius: 24,
    borderWidth: 3,
    backgroundColor: colors.surface,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    color: '#0f1115',
    fontWeight: '800',
    fontSize: 13,
    letterSpacing: 1.5,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  description: {
    color: colors.textMuted,
    fontSize: 18,
    lineHeight: 26,
    textAlign: 'center',
  },
});
