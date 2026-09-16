import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, DrawRecord, Settings, DEFAULT_SETTINGS } from './types';
import { DEFAULT_CARDS } from './data/defaultCards';

const KEYS = {
  cards: 'rtd:cards:v1',
  history: 'rtd:history:v1',
  settings: 'rtd:settings:v1',
};

const MAX_HISTORY = 100;

async function readJson<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function writeJson(key: string, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export const loadCards = () => readJson<Card[]>(KEYS.cards, DEFAULT_CARDS);
export const saveCards = (cards: Card[]) => writeJson(KEYS.cards, cards);

export const loadHistory = () => readJson<DrawRecord[]>(KEYS.history, []);
export const saveHistory = (history: DrawRecord[]) =>
  writeJson(KEYS.history, history.slice(0, MAX_HISTORY));

export const loadSettings = () => readJson<Settings>(KEYS.settings, DEFAULT_SETTINGS);
export const saveSettings = (settings: Settings) => writeJson(KEYS.settings, settings);

export const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
