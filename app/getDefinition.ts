type Meaning = {
  partOfSpeech: string;
  definition: string;
  example?: string | null;
  synonyms?: string[] | null;
  antonyms?: string[] | null;
};

export type Entry = {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
};

export async function getDefinition(word: string): Promise<Entry[]> {
  const query = word.trim();
  if (!query) return [];

  const res = await fetch(`/api/define?word=${encodeURIComponent(query)}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) return [];

    let msg = `Request failed with status ${res.status}`;
    try {
      const j = await res.json();
      if (j?.error) msg = j.error + (j?.detail ? `: ${j.detail}` : "");
      else if (j?.title) msg = j.title;
      else if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }

  return res.json();
}
