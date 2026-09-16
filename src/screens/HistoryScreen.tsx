import React from 'react';
import { FlatList, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useStore } from '../store';
import { colors, typeColor, typeEmoji } from '../theme';

function timeAgo(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(ts).toLocaleDateString();
}

export function HistoryScreen() {
  const { history, clearHistory, settings, updateSettings } = useStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Recent Draws</Text>
          <Text style={styles.sub}>{history.length} cards pulled</Text>
        </View>
        {history.length > 0 && (
          <Pressable onPress={clearHistory} style={styles.ghostBtn}>
            <Text style={styles.ghostText}>Clear</Text>
          </Pressable>
        )}
      </View>

      <FlatList
        data={history}
        keyExtractor={(r) => r.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nothing drawn yet. Go shake the box.</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.emoji}>{typeEmoji[item.type]}</Text>
            <Text style={[styles.title, { color: typeColor[item.type] }]}>{item.title}</Text>
            <Text style={styles.time}>{timeAgo(item.drawnAt)}</Text>
          </View>
        )}
      />

      <View style={styles.settings}>
        <Text style={styles.settingLabel}>Haptic feedback</Text>
        <Switch
          value={settings.haptics}
          onValueChange={(haptics) => updateSettings({ haptics })}
          trackColor={{ true: colors.accent, false: colors.border }}
          thumbColor={colors.text}
        />
      </View>
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
  ghostBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ghostText: { color: colors.textMuted, fontWeight: '700' },
  list: { padding: 20, paddingTop: 8, gap: 8, flexGrow: 1 },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 20 },
  title: { flex: 1, fontSize: 16, fontWeight: '800' },
  time: { color: colors.textMuted, fontSize: 12 },
  settings: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  settingLabel: { color: colors.text, fontWeight: '700' },
});
