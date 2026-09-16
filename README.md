# Roll the Dice BJJ

A digital "draw from the hat" for jiu-jitsu positional training. Tap the mystery box to pull a random
**power-up**, **power-down**, or **wildcard** that changes the rules of the next round.

Built with Expo (React Native) for iOS, Android, and web.

## Features

- **Draw** – shake the box, reveal a card. Filter to only power-ups, power-downs, or wildcards.
  The same card is never drawn twice in a row.
- **The Hat** – 30 default cards. Add your own, edit, toggle cards in/out of the hat, or reset to defaults.
- **Round timer** – 2 / 3 / 5 minute presets with a tap-to-start clock and haptic buzz at time.
- **History** – the last 100 draws, plus a haptics toggle.

Everything is stored on-device (AsyncStorage); no account or backend.

## Run it

```sh
npm install
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), `w` (web), or scan the QR code with Expo Go.

Requires Node >= 20.19.

## Project layout

```
App.tsx                  tab shell (Draw / The Hat / History)
src/types.ts             Card, DrawRecord, Settings
src/data/defaultCards.ts the default deck
src/store.tsx            React context: cards, history, settings, drawCard()
src/storage.ts           AsyncStorage persistence
src/screens/             DrawScreen, DeckScreen, HistoryScreen
src/components/          RevealCard, RoundTimer
```
