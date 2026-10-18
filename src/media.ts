import { Platform } from 'react-native';

export const EMOJIS = ['🦵', '🔺', '💪', '🪢', '🎒', '🏆', '🔒', '❌', '🛏️', '🏔️', '🛡️', '🔥', '💀', '😈', '🤡', '🐢', '🦍', '🐍', '🥋', '🎲'];

export const isUri = (s: string) => /^(data:|file:|content:|blob:|https?:)/.test(s);

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
