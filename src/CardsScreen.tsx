import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Card, CardType, DEFAULT_CARDS, newId } from './cards';

type Props = {
  cards: Card[];
  onChange: (cards: Card[]) => void;
  onClose: () => void;
};

export function CardsScreen({ cards, onChange, onClose }: Props) {
  const update = (id: string, text: string) =>
    onChange(cards.map((c) => (c.id === id ? { ...c, text } : c)));
  const remove = (id: string) => onChange(cards.filter((c) => c.id !== id));
  const add = (type: CardType) => onChange([...cards, { id: newId(), type, text: '' }]);

  const section = (type: CardType, title: string) => (
    <View style={styles.section}>
      <Text style={styles.heading}>{title}</Text>
      {cards
        .filter((c) => c.type === type)
        .map((c) => (
          <View key={c.id} style={styles.row}>
            <TextInput
              value={c.text}
              onChangeText={(t) => update(c.id, t)}
              placeholder="New card"
              placeholderTextColor="#aaa"
              style={styles.input}
            />
            <Pressable onPress={() => remove(c.id)} hitSlop={10} accessibilityLabel="Remove card">
              <Text style={styles.remove}>×</Text>
            </Pressable>
          </View>
        ))}
      <Pressable onPress={() => add(type)}>
        <Text style={styles.link}>+ Add {title.toLowerCase().replace(/s$/, '')}</Text>
      </Pressable>
    </View>
  );

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
  section: { gap: 10 },
  heading: { fontSize: 13, color: '#888', letterSpacing: 2, textTransform: 'uppercase' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    color: '#111',
  },
  remove: { fontSize: 22, color: '#888', paddingHorizontal: 4 },
  link: { color: '#111', fontSize: 16, textDecorationLine: 'underline' },
});
