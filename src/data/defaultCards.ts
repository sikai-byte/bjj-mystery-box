import { Card } from '../types';

const up = (id: string, title: string, description: string): Card => ({
  id,
  type: 'up',
  title,
  description,
  enabled: true,
});
const down = (id: string, title: string, description: string): Card => ({
  id,
  type: 'down',
  title,
  description,
  enabled: true,
});
const wild = (id: string, title: string, description: string): Card => ({
  id,
  type: 'wild',
  title,
  description,
  enabled: true,
});

export const DEFAULT_CARDS: Card[] = [
  // Power-ups
  up('up-grip-lock', 'Grip Lock', 'Your first grip of the round cannot be broken for 10 seconds.'),
  up('up-extra-life', 'Extra Life', 'The first submission you tap to does not count. Reset and keep going.'),
  up('up-home-turf', 'Home Turf', 'Start the round in your favorite position, already established.'),
  up('up-time-freeze', 'Time Freeze', 'Once per round, call "freeze" for a 5-second pause. Your partner must hold still.'),
  up('up-double-points', 'Double Points', 'Every sweep or pass you land counts double.'),
  up('up-leg-license', 'Leg Lock License', 'Leg attacks are allowed for you only this round (stay at your belt-level rules).'),
  up('up-respawn', 'Respawn', 'If you get swept or passed, immediately reset to the starting position.'),
  up('up-hand-of-god', 'Hand of God', 'Once per round, say "release" and your partner must let go of one grip.'),
  up('up-coach-whisper', "Coach's Whisper", 'Your partner must announce their next attack out loud before doing it.'),
  up('up-anchor', 'Anchor', 'Your partner may not stand up during this round.'),
  up('up-mulligan', 'Mulligan', 'Once per round, undo the last position change and restart from before it.'),
  up('up-fresh-legs', 'Fresh Legs', 'You may take a 15-second rest whenever you want, once per round.'),

  // Power-downs
  down('down-one-arm', 'One Arm', 'Keep one hand tucked in your belt for the whole round.'),
  down('down-no-collar', 'No Collar', 'No collar or lapel grips for you this round.'),
  down('down-blindfold', 'Lights Out', 'Eyes closed the entire round. Feel everything.'),
  down('down-grounded', 'Grounded', 'You may not stand up. If you end up standing, drop to your knees.'),
  down('down-no-closed-guard', 'Open Doors', 'Closed guard is banned for you this round.'),
  down('down-sub-only', 'Sub Only', 'Sweeps and passes do not count for you. Only submissions score.'),
  down('down-slow-mo', 'Slow Motion', 'Move at half speed. Your partner moves at full speed.'),
  down('down-velcro', 'Velcro', 'You must keep chest-to-chest contact the whole round.'),
  down('down-no-hooks', 'No Hooks', 'No butterfly hooks or de la Riva hooks for you.'),
  down('down-late-start', 'Late Start', 'You may not initiate any attack or movement for the first 15 seconds.'),
  down('down-narrator', 'Narrator', 'Say every move you make out loud before you do it.'),
  down('down-bottom-dweller', 'Bottom Dweller', 'If you end up on top, you must give the position back.'),
  down('down-one-sub', 'One Trick', 'Pick one submission before the round. It is the only one you may attempt.'),
  down('down-heavy-hands', 'Heavy Hands', 'Hands may only grip below the waist.'),

  // Wildcards
  wild('wild-swap', 'Swap!', 'Both partners swap positions right now.'),
  wild('wild-partner-picks', 'Partner Picks', 'Your partner draws the next card and it applies to you.'),
  wild('wild-double-draw', 'Double Trouble', 'Draw two more cards. Both apply.'),
  wild('wild-mirror', 'Mirror', 'Whatever card your partner has also applies to you.'),
];
