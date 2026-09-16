export type CardType = 'up' | 'down' | 'wild';

export type Card = {
  id: string;
  type: CardType;
  title: string;
  description: string;
  enabled: boolean;
};

export type DrawRecord = {
  id: string;
  cardId: string;
  title: string;
  type: CardType;
  drawnAt: number;
};

export type Settings = {
  roundSeconds: number;
  haptics: boolean;
};

export const DEFAULT_SETTINGS: Settings = {
  roundSeconds: 180,
  haptics: true,
};
