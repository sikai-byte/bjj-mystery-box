import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const API_KEY = process.env.EXPO_PUBLIC_GIPHY_API_KEY ?? '';

type Gif = { id: string; preview: string; url: string };

type Props = { onPick: (url: string) => void; onClose: () => void };

export function GiphyPicker({ onPick, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!API_KEY) return;
    const q = query.trim();
    const handle = setTimeout(() => {
      setLoading(true);
      setError('');
      const url = q
        ? `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(q)}&limit=24&rating=pg-13`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=24&rating=pg-13`;
      fetch(url)
        .then((r) => r.json())
        .then((json: { data?: { id: string; images: Record<string, { url: string }> }[]; meta?: { msg?: string; status?: number } }) => {
          if (!json.data) throw new Error(json.meta?.msg ?? 'Giphy error');
          setGifs(
            json.data.map((g) => ({
              id: g.id,
              preview: g.images.fixed_width_small?.url ?? g.images.fixed_width.url,
              url: g.images.fixed_height?.url ?? g.images.original.url,
            })),
          );
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    }, 350);
    return () => clearTimeout(handle);
  }, [query]);

  return (
    <View style={styles.root}>
      <View style={styles.bar}>
        <Pressable onPress={onClose} hitSlop={10}>
          <Text style={styles.link}>Cancel</Text>
        </Pressable>
        <Text style={styles.title}>GIFs</Text>
        <View style={{ width: 50 }} />
      </View>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search Giphy…"
        placeholderTextColor="#aaa"
        autoFocus
        style={styles.input}
      />
      {!API_KEY ? (
        <Text style={styles.note}>Giphy isn't configured (missing EXPO_PUBLIC_GIPHY_API_KEY).</Text>
      ) : error ? (
        <Text style={styles.note}>{error}</Text>
      ) : null}
      {loading && <ActivityIndicator color="#111" style={{ marginTop: 12 }} />}
      <ScrollView contentContainerStyle={styles.grid} keyboardShouldPersistTaps="handled">
        {gifs.map((g) => (
          <Pressable key={g.id} onPress={() => onPick(g.url)}>
            <Image source={{ uri: g.preview }} style={styles.cell} />
          </Pressable>
        ))}
      </ScrollView>
      <Text style={styles.attrib}>Powered by GIPHY</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  title: { fontSize: 16, color: '#111', letterSpacing: 2, textTransform: 'uppercase' },
  link: { color: '#111', fontSize: 16, textDecorationLine: 'underline' },
  input: {
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    fontSize: 16,
    color: '#111',
  },
  note: { color: '#888', fontSize: 14, textAlign: 'center', marginTop: 16, paddingHorizontal: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, padding: 20 },
  cell: { width: 108, height: 108, borderRadius: 8, backgroundColor: '#f2f2f2' },
  attrib: { color: '#aaa', fontSize: 11, textAlign: 'center', paddingVertical: 8 },
});
