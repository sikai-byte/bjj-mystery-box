import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme';

const PRESETS = [120, 180, 300];

type Props = {
  seconds: number;
  haptics: boolean;
  onChangeSeconds: (s: number) => void;
};

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function RoundTimer({ seconds, haptics, onChangeSeconds }: Props) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(false);
  const endAt = useRef<number | null>(null);

  useEffect(() => {
    if (!running) setRemaining(seconds);
  }, [seconds, running]);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + remaining * 1000;
    const tick = setInterval(() => {
      const left = Math.max(0, Math.round(((endAt.current ?? 0) - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        if (haptics) {
          void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, 250);
    return () => clearInterval(tick);
  }, [running]);

  const toggle = () => {
    if (remaining === 0) {
      setRemaining(seconds);
      setRunning(true);
      return;
    }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setRemaining(seconds);
  };

  const done = remaining === 0;

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        {PRESETS.map((p) => (
          <Pressable
            key={p}
            onPress={() => {
              setRunning(false);
              onChangeSeconds(p);
            }}
            style={[styles.preset, seconds === p && styles.presetActive]}
          >
            <Text style={[styles.presetText, seconds === p && styles.presetTextActive]}>
              {p / 60} min
            </Text>
          </Pressable>
        ))}
      </View>
      <View style={styles.row}>
        <Pressable onPress={toggle} style={[styles.clock, done && styles.clockDone]}>
          <Text style={[styles.clockText, done && styles.clockTextDone]}>
            {done ? 'TIME!' : format(remaining)}
          </Text>
          <Text style={styles.hint}>{running ? 'tap to pause' : done ? 'tap to restart' : 'tap to start'}</Text>
        </Pressable>
        <Pressable onPress={reset} style={styles.reset} accessibilityLabel="Reset timer">
          <Text style={styles.resetText}>↺</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, width: '100%' },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' },
  preset: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetActive: { backgroundColor: colors.surfaceAlt, borderColor: colors.accent },
  presetText: { color: colors.textMuted, fontWeight: '600' },
  presetTextActive: { color: colors.accent },
  clock: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  clockDone: { borderColor: colors.accent },
  clockText: { color: colors.text, fontSize: 36, fontWeight: '800', fontVariant: ['tabular-nums'] },
  clockTextDone: { color: colors.accent },
  hint: { color: colors.textMuted, fontSize: 12 },
  reset: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: { color: colors.text, fontSize: 24 },
});
