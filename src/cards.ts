import AsyncStorage from '@react-native-async-storage/async-storage';

export type CardType = 'up' | 'down';

export type Card = { id: string; type: CardType; text: string };

export type Mode = 'up' | 'mix' | 'down';

const POSITIONS: [up: string, down: string][] = [
  ['Start with a double leg', 'Partner starts with a double leg'],
  ['Start with a single leg', 'Partner starts with a single leg'],
  ['Start with a triangle', 'Partner starts with a triangle'],
  ['Start with an armbar', 'Partner starts with an armbar'],
  ['Start with a guillotine', 'Partner starts with a guillotine'],
  ['Start on the back', 'Partner starts on your back'],
  ['Start up 2 points', 'Start down 2 points'],
  ['Start with a kimura grip', 'Partner starts with a kimura grip'],
  ['Start in single leg X', 'Partner starts in single leg X'],
  ['Start in side control', 'Start under side control'],
  ['Start on mount', 'Start under mount'],
  ['Start in your guard', "Start in partner's guard"],
];

export const DEFAULT_CARDS: Card[] = POSITIONS.flatMap(([up, down], i) => [
  { id: `up-${i}`, type: 'up', text: up },
  { id: `down-${i}`, type: 'down', text: down },
]);

const KEY = 'mystery-box:cards:v1';

export async function loadCards(): Promise<Card[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed as Card[];
    }
  } catch {}
  return DEFAULT_CARDS;
}

export function saveCards(cards: Card[]): void {
  void AsyncStorage.setItem(KEY, JSON.stringify(cards));
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

export function drawCard(cards: Card[], previous: Card | null, mode: Mode): Card | null {
  const deck = mode === 'mix' ? cards : cards.filter((c) => c.type === mode);
  if (deck.length === 0) return null;
  const pool = deck.length > 1 && previous ? deck.filter((c) => c.id !== previous.id) : deck;
  return pool[Math.floor(Math.random() * pool.length)];
}
