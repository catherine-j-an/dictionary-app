"use client";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { getDefinition, type Entry, type Meaning } from "./getDefinition";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [lastTerm, setLastTerm] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Entry[] | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const term = query.trim();

    if (!term) return;
    setHasSearched(true);
    setLastTerm(term);
    setLoading(true);
    setError(null);
    setResult(null);

    function normalizeToEntries(data: unknown): Entry[] {
      const arr = Array.isArray(data) ? data : data ? [data] : [];
      return arr.filter((e) => {
        if (typeof e !== "object" || e === null) return false;
        const obj = e as { word?: unknown; meanings?: unknown };
        return (
          typeof obj.word === "string" &&
          Array.isArray(obj.meanings) &&
          obj.meanings.length > 0
        );
      }) as Entry[];
    }

    try {
      const data = await getDefinition(term);
      const normalized = normalizeToEntries(data);

      if (normalized.length === 0) {
        setResult([]);
      } else {
        setResult(normalized);
      }
    } catch (err) {
      setError(null);
      setResult([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4">
      <form onSubmit={handleSubmit} role="search" className="relative w-full">
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Type a word..."
          aria-label="Word search"
          className="w-full h-12 rounded-2xl border bg-white px-4"
        />

        <button type="submit" aria-label="Search">
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
      {error && <p className="text-sm text-red-600 mt-2">⚠️ {error}</p>}

      {!loading && hasSearched && (!result || result.length === 0) && (
        <p className="text-sm text-white mt-2">
          Results not found for “{lastTerm}”.
        </p>
      )}
      {result && result.length > 0 && <Results entries={result} />}
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
              const defs = Array.isArray(m.definition) ? m.definition : [m];

              return defs.map((d: Meaning, j: number) => (
                <li key={`${i}-${j}`} className="pt-3">
                  <p className="text-md">
                    <span className="italic font-bold text-secondary">
                      {m.partOfSpeech}
                    </span>{" "}
                    : {d.definition ?? m.definition}
                  </p>

                  {d.example && (
                    <p className="text-sm">
                      {" "}
                      <span className=" text-secondary">Example</span> : “
                      {d.example}”
                    </p>
                  )}

                  {d.synonyms?.length && (
                    <p className="text-sm">
                      {" "}
                      <span className=" text-secondary">Synonyms</span> ~{" "}
                      {d.synonyms.join(", ")}
                    </p>
                  )}

                  {d.antonyms?.length && (
                    <p className="text-sm">
                      <span className=" text-secondary">Antonyms</span> {"<> "}
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
