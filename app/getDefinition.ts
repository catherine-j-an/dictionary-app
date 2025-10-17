export type Definition = {
  definition: string;
  example?: string | null;
  synonyms?: string[] | null;
  antonyms?: string[] | null;
};

export type Meaning = {
  partOfSpeech: string;
  definition: string | Definition[];
  example?: string | null;
  synonyms?: string[] | null;
  antonyms?: string[] | null;
};

export type Entry = {
  word: string;
  phonetic?: string;
  meanings: Meaning[];
};

export type ImageResult = {
  id?: number;
  alt?: string;
  url?: string;
  src?:
    | string
    | {
        small?: string;
        medium?: string;
        large?: string;
        original?: string;
      };
};

export type DefinitionResponse = {
  dictionary: Entry[];
  images: ImageResult[];
  query: string;
};

export async function getDefinition(word: string): Promise<DefinitionResponse> {
  const query = word.trim();
  if (!query) {
    return { dictionary: [], images: [], query: "" };
  }

  try {
    const res = await fetch(`/api/define?word=${encodeURIComponent(query)}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return { dictionary: [], images: [], query };
    }

    const data: unknown = await res.json();

    if (
      typeof data === "object" &&
      data !== null &&
      "dictionary" in data &&
      "images" in data
    ) {
      const {
        dictionary,
        images,
        query: returnedQuery,
      } = data as {
        dictionary?: Entry[];
        images?: ImageResult[];
        query?: string;
      };

      return {
        dictionary: Array.isArray(dictionary) ? dictionary : [],
        images: Array.isArray(images) ? images : [],
        query: typeof returnedQuery === "string" ? returnedQuery : query,
      };
    }

    return { dictionary: [], images: [], query };
  } catch {
    return { dictionary: [], images: [], query };
  }
}
