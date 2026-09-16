import { CardType } from './types';

export const colors = {
  bg: '#0f1115',
  surface: '#181b22',
  surfaceAlt: '#20242d',
  border: '#2a2f3a',
  text: '#f2f4f8',
  textMuted: '#9aa3b2',
  accent: '#ffb020',
  up: '#2ecc71',
  down: '#ff4d6d',
  wild: '#8e7cff',
};

export const typeColor: Record<CardType, string> = {
  up: colors.up,
  down: colors.down,
  wild: colors.wild,
};

export const typeLabel: Record<CardType, string> = {
  up: 'POWER-UP',
  down: 'POWER-DOWN',
  wild: 'WILDCARD',
};

export const typeEmoji: Record<CardType, string> = {
  up: '⚡',
  down: '⛓️',
  wild: '🎲',
};
