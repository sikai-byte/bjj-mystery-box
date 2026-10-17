import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import { Card, DEFAULT_CARDS, Mode, drawCard, loadCards, saveCards } from './src/cards';
import { CardsScreen } from './src/CardsScreen';
import { Timer } from './src/Timer';

type Phase = 'idle' | 'drawing' | 'revealed' | 'timer' | 'cards';

const MODES: { key: Mode; label: string }[] = [
  { key: 'up', label: 'Power-ups' },
  { key: 'mix', label: 'Mix' },
  { key: 'down', label: 'Power-downs' },
];

export default function App() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [card, setCard] = useState<Card | null>(null);
  const [mode, setMode] = useState<Mode>('mix');
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  useEffect(() => {
    void loadCards().then(setCards);
  }, []);

  const changeCards = (next: Card[]) => {
    setCards(next);
    saveCards(next);
  };

  const closeCards = () => {
    changeCards(cards.filter((c) => c.text.trim() !== ''));
    setCard(null);
    setPhase('idle');
  };
  const fade = useRef(new Animated.Value(1)).current;
  const spin = useRef(new Animated.Value(0)).current;

  const draw = () => {
    if (phase === 'drawing') return;
    setPhase('drawing');
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    spin.setValue(0);
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(spin, {
        toValue: 1,
        duration: 900,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setCard((prev) => drawCard(cardsRef.current, prev, mode));
      setPhase('revealed');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      Animated.timing(fade, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    });
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '720deg'] });

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.root}>
        {phase === 'cards' ? (
          <CardsScreen cards={cards} onChange={changeCards} onClose={closeCards} />
        ) : phase === 'timer' ? (
          <Timer onClose={() => setPhase('idle')} />
        ) : (
          <View style={styles.center}>
            <View style={styles.segmented}>
              {MODES.map((m) => (
                <Pressable
                  key={m.key}
                  onPress={() => setMode(m.key)}
                  style={[styles.segment, mode === m.key && styles.segmentActive]}
                >
                  <Text style={[styles.segmentText, mode === m.key && styles.segmentTextActive]}>
                    {m.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Animated.View style={[styles.content, { opacity: fade }]}>
              {phase === 'revealed' && card ? (
                <>
                  <Text style={styles.kicker}>{card.type === 'up' ? 'Power-up' : 'Power-down'}</Text>
                  <Text style={styles.cardText}>{card.text}</Text>
                </>
              ) : (
                <Text style={styles.title}>Mystery Box</Text>
              )}
              {phase === 'revealed' && !card && (
                <Text style={styles.empty}>No cards in this mode — add some below.</Text>
              )}
            </Animated.View>

            <View style={styles.actions}>
              {phase === 'revealed' && card ? (
                <>
                  <Pressable style={styles.primary} onPress={() => setPhase('timer')}>
                    <Text style={styles.primaryText}>Start timer</Text>
                  </Pressable>
                  <Pressable onPress={draw}>
                    <Text style={styles.link}>Draw again</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable style={styles.primary} onPress={draw} disabled={phase === 'drawing'}>
                  <Animated.Text style={[styles.primaryText, { transform: [{ rotate }] }]}>
                    {phase === 'drawing' ? '◌' : 'Draw'}
                  </Animated.Text>
                </Pressable>
              )}
              <Pressable onPress={() => setPhase('cards')} hitSlop={10}>
                <Text style={styles.subtle}>Edit cards ({cards.length})</Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 48 },
  content: { alignItems: 'center', minHeight: 160, justifyContent: 'center' },
  title: { fontSize: 22, color: '#111', letterSpacing: 2, textTransform: 'uppercase', fontWeight: '300' },
  kicker: { fontSize: 13, color: '#888', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 14 },
  cardText: { fontSize: 36, color: '#111', fontWeight: '600', textAlign: 'center', lineHeight: 44 },
  actions: { alignItems: 'center', gap: 22 },
  segmented: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#111',
    borderRadius: 999,
    overflow: 'hidden',
  },
  segment: { paddingHorizontal: 16, paddingVertical: 9 },
  segmentActive: { backgroundColor: '#111' },
  segmentText: { color: '#111', fontSize: 14, fontWeight: '600' },
  segmentTextActive: { color: '#fff' },
  primary: {
    backgroundColor: '#111',
    paddingHorizontal: 44,
    paddingVertical: 18,
    borderRadius: 999,
    minWidth: 180,
    alignItems: 'center',
  },
  primaryText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  link: { color: '#111', fontSize: 16, textDecorationLine: 'underline' },
  subtle: { color: '#888', fontSize: 14, marginTop: 10 },
  empty: { color: '#888', fontSize: 16, textAlign: 'center' },
});
