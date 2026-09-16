import React, { useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useStore } from '../store';
import { Card, CardType } from '../types';
import { colors, typeColor } from '../theme';
import { RevealCard } from '../components/RevealCard';
import { RoundTimer } from '../components/RoundTimer';

type Filter = 'any' | CardType;

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'any', label: 'Anything' },
  { key: 'up', label: 'Power-ups' },
  { key: 'down', label: 'Power-downs' },
  { key: 'wild', label: 'Wildcards' },
];

export function DrawScreen() {
  const { cards, drawCard, settings, updateSettings } = useStore();
  const [filter, setFilter] = useState<Filter>('any');
  const [current, setCurrent] = useState<Card | null>(null);
  const [drawing, setDrawing] = useState(false);

  const shake = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const reveal = useRef(new Animated.Value(0)).current;

  const enabledCount = cards.filter(
    (c) => c.enabled && (filter === 'any' || c.type === filter),
  ).length;

  const buzz = (style: Haptics.ImpactFeedbackStyle) => {
    if (settings.haptics) void Haptics.impactAsync(style);
  };

  const onDraw = () => {
    if (drawing || enabledCount === 0) return;
    setDrawing(true);
    setCurrent(null);
    reveal.setValue(0);
    buzz(Haptics.ImpactFeedbackStyle.Light);

    const wobble = Animated.sequence(
      [1, -1, 1, -1, 1, -1, 0.5, -0.5, 0].map((v, i) =>
        Animated.timing(shake, {
          toValue: v,
          duration: 60 + i * 10,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ),
    );
    const pump = Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 350, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.9, duration: 200, useNativeDriver: true }),
    ]);

    Animated.parallel([wobble, pump]).start(() => {
      const card = drawCard(filter === 'any' ? undefined : [filter]);
      setCurrent(card);
      buzz(Haptics.ImpactFeedbackStyle.Heavy);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(reveal, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start(() => setDrawing(false));
    });
  };

  const rotate = shake.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] });
  const revealStyle = {
    opacity: reveal,
    transform: [
      { translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) },
      { scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) },
    ],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Mystery Box</Text>
      <Text style={styles.sub}>Draw a card. Roll with it. Reset when the bell rings.</Text>

      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = filter === f.key;
          const color = f.key === 'any' ? colors.accent : typeColor[f.key];
          return (
            <Pressable
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={[styles.chip, active && { borderColor: color, backgroundColor: colors.surfaceAlt }]}
            >
              <Text style={[styles.chipText, active && { color }]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable onPress={onDraw} disabled={drawing || enabledCount === 0} style={styles.boxWrap}>
        <Animated.View style={[styles.box, { transform: [{ rotate }, { scale }] }]}>
          <Text style={styles.boxEmoji}>🎁</Text>
        </Animated.View>
        <Text style={styles.boxLabel}>
          {enabledCount === 0
            ? 'No cards enabled for this filter'
            : drawing
              ? 'Shaking…'
              : `Tap to draw · ${enabledCount} cards in the hat`}
        </Text>
      </Pressable>

      {current && (
        <Animated.View style={[styles.revealWrap, revealStyle]}>
          <RevealCard card={current} />
          <Pressable onPress={onDraw} style={styles.again}>
            <Text style={styles.againText}>Draw again</Text>
          </Pressable>
        </Animated.View>
      )}

      <RoundTimer
        seconds={settings.roundSeconds}
        haptics={settings.haptics}
        onChangeSeconds={(s) => updateSettings({ roundSeconds: s })}
      />
      <Text style={styles.safety}>Safety first: a card never overrides tapping or your gym's rules.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40, gap: 18, alignItems: 'center' },
  heading: { color: colors.text, fontSize: 32, fontWeight: '900', marginTop: 8 },
  sub: { color: colors.textMuted, fontSize: 15, textAlign: 'center', marginTop: -10 },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipText: { color: colors.textMuted, fontWeight: '700' },
  boxWrap: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  box: {
    width: 160,
    height: 160,
    borderRadius: 32,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxEmoji: { fontSize: 84 },
  boxLabel: { color: colors.textMuted, fontSize: 14 },
  revealWrap: { width: '100%', gap: 12, alignItems: 'center' },
  again: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  againText: { color: '#0f1115', fontWeight: '800', fontSize: 16 },
  safety: { color: colors.textMuted, fontSize: 12, textAlign: 'center' },
});
