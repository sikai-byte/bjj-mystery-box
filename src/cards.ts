export type CardType = 'up' | 'down';

export type Card = { type: CardType; text: string };

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

export const CARDS: Card[] = POSITIONS.flatMap(([up, down]) => [
  { type: 'up', text: up },
  { type: 'down', text: down },
]);

export type Mode = 'up' | 'mix' | 'down';

export function drawCard(previous: Card | null, mode: Mode = 'mix'): Card {
  const deck = mode === 'mix' ? CARDS : CARDS.filter((c) => c.type === mode);
  const pool = deck.length > 1 && previous ? deck.filter((c) => c.text !== previous.text) : deck;
  return pool[Math.floor(Math.random() * pool.length)];
}
