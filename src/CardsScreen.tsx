import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Card, CardType, DEFAULT_CARDS, newCard } from './cards';
import { EMOJIS, isUri } from './media';
import { GiphyPicker } from './GiphyPicker';

type Props = {
  cards: Card[];
  onChange: (cards: Card[]) => void;
  onClose: () => void;
};

export function CardsScreen({ cards, onChange, onClose }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [gifFor, setGifFor] = useState<string | null>(null);

  const patch = (id: string, p: Partial<Card>) =>
    onChange(cards.map((c) => (c.id === id ? { ...c, ...p } : c)));
  const remove = (id: string) => onChange(cards.filter((c) => c.id !== id));

  const pickImage = async (id: string) => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });
    if (res.canceled) return;
    const a = res.assets[0];
    patch(id, { image: a.base64 ? `data:${a.mimeType ?? 'image/jpeg'};base64,${a.base64}` : a.uri });
  };

  const row = (c: Card) => {
    const expanded = open === c.id;
    return (
      <View key={c.id} style={styles.card}>
        <View style={styles.row}>
          <Pressable onPress={() => setOpen(expanded ? null : c.id)} hitSlop={6}>
            {isUri(c.image) ? (
              <Image source={{ uri: c.image }} style={styles.thumb} />
            ) : (
              <Text style={styles.emoji}>{c.image || '·'}</Text>
            )}
          </Pressable>
          <TextInput
            value={c.text}
            onChangeText={(t) => patch(c.id, { text: t })}
            placeholder="New card"
            placeholderTextColor="#aaa"
            style={styles.input}
          />
          <Pressable onPress={() => remove(c.id)} hitSlop={10} accessibilityLabel="Remove card">
            <Text style={styles.remove}>×</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => setOpen(expanded ? null : c.id)}>
          <Text style={styles.meta}>
            {expanded ? 'close' : 'edit picture'}
          </Text>
        </Pressable>
        {expanded && (
          <View style={styles.editor}>
            <Text style={styles.label}>Picture</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
              {EMOJIS.map((e) => (
                <Pressable
                  key={e}
                  onPress={() => patch(c.id, { image: e })}
                  style={[styles.chip, c.image === e && styles.chipActive]}
                >
                  <Text style={styles.chipEmoji}>{e}</Text>
                </Pressable>
              ))}
              <Pressable onPress={() => setGifFor(c.id)} style={[styles.chip, isUri(c.image) && styles.chipActive]}>
                <Text style={[styles.chipText, isUri(c.image) && styles.chipTextActive]}>GIF search…</Text>
              </Pressable>
              <Pressable onPress={() => void pickImage(c.id)} style={styles.chip}>
                <Text style={styles.chipText}>Upload…</Text>
              </Pressable>
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  const section = (type: CardType, title: string) => (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {cards.filter((c) => c.type === type).map(row)}
      <Pressable onPress={() => onChange([...cards, newCard(type)])}>
        <Text style={styles.link}>+ Add {title.toLowerCase().replace(/s$/, '')}</Text>
      </Pressable>
    </View>
  );

  if (gifFor) {
    return (
      <GiphyPicker
        onClose={() => setGifFor(null)}
        onPick={(url) => {
          patch(gifFor, { image: url });
          setGifFor(null);
        }}
      />
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={styles.link}>Done</Text>
        </Pressable>
        <Text style={styles.title}>Cards</Text>
        <Pressable onPress={() => onChange(DEFAULT_CARDS)} hitSlop={10}>
          <Text style={styles.link}>Reset</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
        {section('up', 'Power-ups')}
        {section('down', 'Power-downs')}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 16, color: '#111', letterSpacing: 2, textTransform: 'uppercase' },
  list: { paddingHorizontal: 20, paddingBottom: 40, gap: 28 },
  section: { gap: 14 },
  heading: { fontSize: 13, color: '#888', letterSpacing: 2, textTransform: 'uppercase' },
  card: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 24, width: 32, textAlign: 'center' },
  thumb: { width: 32, height: 32, borderRadius: 6 },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    color: '#111',
  },
  remove: { fontSize: 22, color: '#888', paddingHorizontal: 4 },
  meta: { fontSize: 12, color: '#888', marginLeft: 44 },
  editor: { gap: 6, paddingVertical: 6 },
  label: { fontSize: 11, color: '#888', letterSpacing: 1.5, textTransform: 'uppercase' },
  chips: { flexDirection: 'row', gap: 8, paddingVertical: 2 },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipEmoji: { fontSize: 18 },
  chipText: { fontSize: 13, color: '#111' },
  chipTextActive: { color: '#fff' },
  link: { color: '#111', fontSize: 16, textDecorationLine: 'underline' },
});
