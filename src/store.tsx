import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Card, CardType, DrawRecord, Settings, DEFAULT_SETTINGS } from './types';
import { DEFAULT_CARDS } from './data/defaultCards';
import {
  loadCards,
  loadHistory,
  loadSettings,
  newId,
  saveCards,
  saveHistory,
  saveSettings,
} from './storage';

type Store = {
  ready: boolean;
  cards: Card[];
  history: DrawRecord[];
  settings: Settings;
  drawCard: (types?: CardType[]) => Card | null;
  addCard: (card: Omit<Card, 'id' | 'enabled'>) => void;
  updateCard: (card: Card) => void;
  deleteCard: (id: string) => void;
  toggleCard: (id: string) => void;
  resetDeck: () => void;
  clearHistory: () => void;
  updateSettings: (patch: Partial<Settings>) => void;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  const [history, setHistory] = useState<DrawRecord[]>([]);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    Promise.all([loadCards(), loadHistory(), loadSettings()]).then(([c, h, s]) => {
      setCards(c);
      setHistory(h);
      setSettings({ ...DEFAULT_SETTINGS, ...s });
      setReady(true);
    });
  }, []);

  const persistCards = useCallback((next: Card[]) => {
    setCards(next);
    void saveCards(next);
  }, []);

  const drawCard = useCallback(
    (types?: CardType[]) => {
      const pool = cards.filter((c) => c.enabled && (!types || types.includes(c.type)));
      if (pool.length === 0) return null;
      const lastId = history[0]?.cardId;
      const candidates = pool.length > 1 ? pool.filter((c) => c.id !== lastId) : pool;
      const card = candidates[Math.floor(Math.random() * candidates.length)];
      const record: DrawRecord = {
        id: newId(),
        cardId: card.id,
        title: card.title,
        type: card.type,
        drawnAt: Date.now(),
      };
      const next = [record, ...history].slice(0, 100);
      setHistory(next);
      void saveHistory(next);
      return card;
    },
    [cards, history],
  );

  const addCard = useCallback(
    (card: Omit<Card, 'id' | 'enabled'>) =>
      persistCards([...cards, { ...card, id: newId(), enabled: true }]),
    [cards, persistCards],
  );

  const updateCard = useCallback(
    (card: Card) => persistCards(cards.map((c) => (c.id === card.id ? card : c))),
    [cards, persistCards],
  );

  const deleteCard = useCallback(
    (id: string) => persistCards(cards.filter((c) => c.id !== id)),
    [cards, persistCards],
  );

  const toggleCard = useCallback(
    (id: string) =>
      persistCards(cards.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))),
    [cards, persistCards],
  );

  const resetDeck = useCallback(() => persistCards(DEFAULT_CARDS), [persistCards]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    void saveHistory([]);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<Settings>) => {
      const next = { ...settings, ...patch };
      setSettings(next);
      void saveSettings(next);
    },
    [settings],
  );

  const value = useMemo<Store>(
    () => ({
      ready,
      cards,
      history,
      settings,
      drawCard,
      addCard,
      updateCard,
      deleteCard,
      toggleCard,
      resetDeck,
      clearHistory,
      updateSettings,
    }),
    [
      ready,
      cards,
      history,
      settings,
      drawCard,
      addCard,
      updateCard,
      deleteCard,
      toggleCard,
      resetDeck,
      clearHistory,
      updateSettings,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
