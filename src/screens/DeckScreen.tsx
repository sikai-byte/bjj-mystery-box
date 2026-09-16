import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useStore } from '../store';
import { Card, CardType } from '../types';
import { colors, typeColor, typeEmoji, typeLabel } from '../theme';

const TYPES: CardType[] = ['up', 'down', 'wild'];

type Draft = { id?: string; type: CardType; title: string; description: string };

const EMPTY: Draft = { type: 'up', title: '', description: '' };

export function DeckScreen() {
  const { cards, addCard, updateCard, deleteCard, toggleCard, resetDeck } = useStore();
  const [draft, setDraft] = useState<Draft | null>(null);

  const openNew = () => setDraft(EMPTY);
  const openEdit = (c: Card) =>
    setDraft({ id: c.id, type: c.type, title: c.title, description: c.description });

  const save = () => {
    if (!draft || !draft.title.trim()) return;
    const payload = {
      type: draft.type,
      title: draft.title.trim(),
      description: draft.description.trim(),
    };
    if (draft.id) {
      const existing = cards.find((c) => c.id === draft.id);
      if (existing) updateCard({ ...existing, ...payload });
    } else {
      addCard(payload);
    }
    setDraft(null);
  };

  const confirmDelete = (c: Card) => {
    Alert.alert('Delete card', `Remove "${c.title}" from the hat?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCard(c.id) },
    ]);
  };

  const confirmReset = () => {
    Alert.alert('Reset deck', 'Restore the default cards? Your custom cards will be removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetDeck },
    ]);
  };

  const enabled = cards.filter((c) => c.enabled).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>The Hat</Text>
          <Text style={styles.sub}>
            {enabled} of {cards.length} cards in play
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={confirmReset} style={styles.ghostBtn}>
            <Text style={styles.ghostText}>Reset</Text>
          </Pressable>
          <Pressable onPress={openNew} style={styles.primaryBtn}>
            <Text style={styles.primaryText}>+ Add</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={cards}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openEdit(item)}
            onLongPress={() => confirmDelete(item)}
            style={[styles.row, !item.enabled && styles.rowDisabled]}
          >
            <View style={[styles.stripe, { backgroundColor: typeColor[item.type] }]} />
            <View style={styles.rowBody}>
              <Text style={styles.rowType}>
                {typeEmoji[item.type]} {typeLabel[item.type]}
              </Text>
              <Text style={styles.rowTitle}>{item.title}</Text>
              <Text style={styles.rowDesc} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
            <Switch
              value={item.enabled}
              onValueChange={() => toggleCard(item.id)}
              trackColor={{ true: typeColor[item.type], false: colors.border }}
              thumbColor={colors.text}
            />
          </Pressable>
        )}
        ListFooterComponent={
          <Text style={styles.footerHint}>Tap a card to edit · long-press to delete</Text>
        }
      />

      <Modal visible={draft !== null} animationType="slide" transparent onRequestClose={() => setDraft(null)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          {draft && (
            <View style={styles.sheet}>
              <Text style={styles.sheetTitle}>{draft.id ? 'Edit card' : 'New card'}</Text>
              <View style={styles.typeRow}>
                {TYPES.map((t) => {
                  const active = draft.type === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setDraft({ ...draft, type: t })}
                      style={[styles.typeChip, active && { borderColor: typeColor[t], backgroundColor: colors.surfaceAlt }]}
                    >
                      <Text style={[styles.typeChipText, active && { color: typeColor[t] }]}>
                        {typeEmoji[t]} {typeLabel[t]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              <TextInput
                value={draft.title}
                onChangeText={(title) => setDraft({ ...draft, title })}
                placeholder="Title (e.g. One Arm)"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                maxLength={40}
              />
              <TextInput
                value={draft.description}
                onChangeText={(description) => setDraft({ ...draft, description })}
                placeholder="What does it do?"
                placeholderTextColor={colors.textMuted}
                style={[styles.input, styles.inputMulti]}
                multiline
                maxLength={200}
              />
              <View style={styles.sheetActions}>
                <Pressable onPress={() => setDraft(null)} style={styles.ghostBtn}>
                  <Text style={styles.ghostText}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={save}
                  disabled={!draft.title.trim()}
                  style={[styles.primaryBtn, !draft.title.trim() && styles.disabled]}
                >
                  <Text style={styles.primaryText}>Save</Text>
                </Pressable>
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 8,
  },
  heading: { color: colors.text, fontSize: 28, fontWeight: '900' },
  sub: { color: colors.textMuted, fontSize: 13 },
  headerActions: { flexDirection: 'row', gap: 8 },
  list: { padding: 20, paddingTop: 8, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    paddingRight: 12,
  },
  rowDisabled: { opacity: 0.45 },
  stripe: { width: 6, alignSelf: 'stretch' },
  rowBody: { flex: 1, padding: 12, gap: 2 },
  rowType: { color: colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  rowTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  rowDesc: { color: colors.textMuted, fontSize: 13 },
  footerHint: { color: colors.textMuted, fontSize: 12, textAlign: 'center', marginTop: 8 },
  primaryBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  primaryText: { color: '#0f1115', fontWeight: '800' },
  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostText: { color: colors.textMuted, fontWeight: '700' },
  disabled: { opacity: 0.4 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
    gap: 12,
  },
  sheetTitle: { color: colors.text, fontSize: 22, fontWeight: '900' },
  typeRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  typeChipText: { color: colors.textMuted, fontWeight: '700', fontSize: 12 },
  input: {
    backgroundColor: colors.surfaceAlt,
    color: colors.text,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputMulti: { minHeight: 90, textAlignVertical: 'top' },
  sheetActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginTop: 4 },
});
