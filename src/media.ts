import { Platform } from 'react-native';
import { AudioSource, createAudioPlayer, setAudioModeAsync } from 'expo-audio';

export const SOUNDS: Record<string, { label: string; src: number }> = {
  airhorn: { label: 'Airhorn', src: require('../assets/sounds/airhorn.mp3') },
  boom: { label: 'Vine boom', src: require('../assets/sounds/boom.mp3') },
  trombone: { label: 'Sad trombone', src: require('../assets/sounds/trombone.mp3') },
  buzzer: { label: 'Buzzer', src: require('../assets/sounds/buzzer.mp3') },
  ding: { label: 'Ding', src: require('../assets/sounds/ding.mp3') },
  drumroll: { label: 'Drumroll', src: require('../assets/sounds/drumroll.mp3') },
  whoosh: { label: 'Whoosh', src: require('../assets/sounds/whoosh.mp3') },
  applause: { label: 'Applause', src: require('../assets/sounds/applause.mp3') },
};

export const EMOJIS = ['🦵', '🔺', '💪', '🪢', '🎒', '🏆', '🔒', '❌', '🛏️', '🏔️', '🛡️', '🔥', '💀', '😈', '🤡', '🐢', '🦍', '🐍', '🥋', '🎲'];

export const isUri = (s: string) => /^(data:|file:|content:|blob:|https?:)/.test(s);

export function soundLabel(sound: string): string {
  if (!sound) return 'No sound';
  return SOUNDS[sound]?.label ?? 'Custom sound';
}

void setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});

let current: ReturnType<typeof createAudioPlayer> | null = null;

export function playSound(sound: string): void {
  if (!sound) return;
  const source: AudioSource = isUri(sound) ? { uri: sound } : (SOUNDS[sound]?.src ?? null);
  if (source === null) return;
  try {
    current?.remove();
    const player = createAudioPlayer(source);
    current = player;
    player.play();
    setTimeout(() => {
      if (current === player) {
        player.remove();
        current = null;
      }
    }, 8000);
  } catch {}
}

export async function toPersistentUri(uri: string): Promise<string> {
  if (Platform.OS !== 'web' || uri.startsWith('data:')) return uri;
  const blob = await (await fetch(uri)).blob();
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
