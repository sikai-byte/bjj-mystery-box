import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { StoreProvider, useStore } from './src/store';
import { DrawScreen } from './src/screens/DrawScreen';
import { DeckScreen } from './src/screens/DeckScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { colors } from './src/theme';

type Tab = 'draw' | 'deck' | 'history';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'draw', label: 'Draw', icon: '🎁' },
  { key: 'deck', label: 'The Hat', icon: '🎩' },
  { key: 'history', label: 'History', icon: '🕒' },
];

function Shell() {
  const { ready } = useStore();
  const [tab, setTab] = useState<Tab>('draw');

  if (!ready) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Shuffling the hat…</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.body}>
        {tab === 'draw' && <DrawScreen />}
        {tab === 'deck' && <DeckScreen />}
        {tab === 'history' && <HistoryScreen />}
      </View>
      <View style={styles.tabBar}>
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <Pressable key={t.key} onPress={() => setTab(t.key)} style={styles.tab}>
              <Text style={styles.tabIcon}>{t.icon}</Text>
              <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{t.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <StoreProvider>
        <StatusBar style="light" />
        <Shell />
      </StoreProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  body: { flex: 1 },
  loading: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: colors.textMuted },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    paddingBottom: 6,
  },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 10, gap: 2 },
  tabIcon: { fontSize: 20 },
  tabLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '700' },
  tabLabelActive: { color: colors.accent },
});
