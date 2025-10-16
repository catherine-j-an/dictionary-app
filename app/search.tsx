"use client";
import Image from "next/image";
import { useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    console.log("Submitted:", query);
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        role="search"
        className="relative mx-auto w-full"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          autoFocus
          placeholder="Type a word..."
          aria-label="Word search"
          className="input-position rounded-2xl border bg-white px-4"
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
    </div>
  );
}
