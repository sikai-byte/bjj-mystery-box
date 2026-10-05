import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';

const PRESETS = [60, 180, 300];

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function Timer({ onClose }: { onClose: () => void }) {
  const [duration, setDuration] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endAt = useRef(0);

  useEffect(() => {
    if (!running) return;
    endAt.current = Date.now() + remaining * 1000;
    const tick = setInterval(() => {
      const left = Math.max(0, Math.round((endAt.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) {
        setRunning(false);
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }, 250);
    return () => clearInterval(tick);
  }, [running]);

  if (duration === null) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.label}>How long?</Text>
        <View style={styles.row}>
          {PRESETS.map((p) => (
            <Pressable
              key={p}
              style={styles.preset}
              onPress={() => {
                setDuration(p);
                setRemaining(p);
                setRunning(true);
              }}
            >
              <Text style={styles.presetText}>{p / 60} min</Text>
            </Pressable>
          ))}
        </View>
        <Pressable onPress={onClose}>
          <Text style={styles.link}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const done = remaining === 0;
  return (
    <View style={styles.wrap}>
      <Pressable onPress={() => !done && setRunning((r) => !r)}>
        <Text style={[styles.clock, done && styles.clockDone]}>{done ? 'Time' : format(remaining)}</Text>
        {!done && <Text style={styles.label}>{running ? 'tap to pause' : 'tap to resume'}</Text>}
      </Pressable>
      <View style={styles.row}>
        <Pressable
          onPress={() => {
            setRemaining(duration);
            setRunning(true);
          }}
        >
          <Text style={styles.link}>Restart</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            setRunning(false);
            setDuration(null);
          }}
        >
          <Text style={styles.link}>Change time</Text>
        </Pressable>
        <Pressable onPress={onClose}>
          <Text style={styles.link}>Draw again</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 28 },
  row: { flexDirection: 'row', gap: 24, alignItems: 'center' },
  label: { color: '#888', fontSize: 15, textAlign: 'center' },
  preset: {
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#111',
  },
  presetText: { color: '#111', fontSize: 17, fontWeight: '600' },
  clock: { color: '#111', fontSize: 84, fontWeight: '300', fontVariant: ['tabular-nums'], textAlign: 'center' },
  clockDone: { fontWeight: '600' },
  link: { color: '#111', fontSize: 16, textDecorationLine: 'underline' },
});
