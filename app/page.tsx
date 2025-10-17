import Image from "next/image";
import Link from "next/link";

import SearchInput from "./search";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white sm:text-[58px] sm:font-semibold text-[42px] font-semibold p-8">
        English Dictionary
      </h1>
      <SearchInput />
      <div className="text-white p-8">
        This code is developed by Catherine An and open-sourced on{" "}
        <Link
          href="https://github.com/catherine-j-an/dictionary-app"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-secondary transition"
        >
          GitHub
        </Link>
        .
      </div>
    </div>
  );
}
