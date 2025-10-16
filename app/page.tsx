import Image from "next/image";
import SearchInput from "./search";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-white sm:text-[58px] sm:font-semibold text-[32px] font-semibold p-8">
        English Dictionary
      </h1>
      <SearchInput />
    </div>
  );
}
