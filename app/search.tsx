"use client";

import Image from "next/image";
import { useState, FormEvent } from "react";
import {
  getDefinition,
  type Entry,
  type Meaning,
  type ImageResult,
} from "./getDefinition";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [lastTerm, setLastTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Entry[] | null>(null);
  const [images, setImages] = useState<ImageResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();
    if (!term) return;

    setLastTerm(term);
    setLoading(true);
    setResult(null);
    setImages([]);
    setHasSearched(true);

    try {
      const data = await getDefinition(term);
      setResult(data.dictionary);
      setImages(data.images);
    } catch {
      setResult([]);
      setImages([]);
    } finally {
      setLoading(false);
    }
  }

  const noResults =
    hasSearched &&
    !loading &&
    (result?.length ?? 0) === 0 &&
    (images?.length ?? 0) === 0;

  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <form onSubmit={handleSubmit} role="search" className="relative w-full">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          placeholder="Type a word..."
          aria-label="Word search"
          aria-busy={loading}
          className="w-full h-12 rounded-2xl border bg-white px-4"
        />

        <button
          type="submit"
          aria-label="Search"
          disabled={loading || !query.trim()}
        >
          <Image
            src="/search_icon.svg"
            alt="Search"
            width={25}
            height={25}
            className="icon-position !cursor-pointer"
          />
        </button>
      </form>

      {loading && <p className="text-sm text-white mt-2">Searching...</p>}

      {noResults && (
        <p className="text-sm text-white mt-2">
          Results not found for “{lastTerm}”.
        </p>
      )}

      {result && result.length > 0 && <Results entries={result} />}
      {images.length > 0 && <ImagesGrid images={images} />}
    </div>
  );
}

function Results({ entries }: { entries: Entry[] }) {
  return (
    <div className="mt-8 space-y-4 w-full">
      {entries.map((entry, idx) => (
        <div
          key={`${entry.word}-${idx}`}
          className="space-y-1 bg-white rounded-2xl p-4"
        >
          <div className="text-xl text-secondary font-bold">
            {entry.word}
            {entry.phonetic ? (
              <div className="text-md italic text-secondary font-light">
                /{entry.phonetic}/
              </div>
            ) : null}
          </div>

          <ul>
            {entry.meanings?.map((m: Meaning, i: number) => {
              const defs = Array.isArray(m.definition)
                ? m.definition
                : [{ definition: m.definition }];

              return defs.map((d, j) => (
                <li key={`${i}-${j}`} className="pt-3">
                  <p className="text-md">
                    <span className="italic font-bold text-secondary">
                      {m.partOfSpeech}
                    </span>{" "}
                    : {d.definition}
                  </p>

                  {d.example && (
                    <p className="text-sm">
                      <span className="text-secondary">Example</span> : “
                      {d.example}”
                    </p>
                  )}

                  {!!d.synonyms?.length && (
                    <p className="text-sm">
                      <span className="text-secondary">Synonyms</span> ~{" "}
                      {d.synonyms.join(", ")}
                    </p>
                  )}

                  {!!d.antonyms?.length && (
                    <p className="text-sm">
                      <span className="text-secondary">Antonyms</span> {"<> "}
                      {d.antonyms.join(", ")}
                    </p>
                  )}
                </li>
              ));
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

function ImagesGrid({ images }: { images: ImageResult[] }) {
  return (
    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {images.map((img, i) => {
        const src =
          typeof img.src === "string"
            ? img.src
            : img.src?.small ||
              img.src?.medium ||
              img.src?.large ||
              img.src?.original ||
              img.url ||
              "";

        if (!src) return null;

        const key = String(img.id ?? src ?? i);

        return (
          <div
            key={key}
            className="relative w-full h-32 overflow-hidden rounded-xl border bg-white"
          >
            <Image
              src={src}
              alt={img.alt || "result"}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}
