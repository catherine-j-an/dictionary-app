import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const API_KEY = "bf84c5dt8ba6f1571of07a1c8e407cf3";
const TIMEOUT_MS = 8000;

export async function GET(req: Request) {
  const word = new URL(req.url).searchParams.get("word")?.trim();
  if (!word) {
    return NextResponse.json(
      { error: "Missing 'word' param" },
      { status: 400 }
    );
  }

  const dictionary = new URL("https://api.shecodes.io/dictionary/v1/define");
  dictionary.search = new URLSearchParams({ word, key: API_KEY }).toString();

  const images = new URL("https://api.shecodes.io/images/v1/search");
  images.search = new URLSearchParams({ query: word, key: API_KEY }).toString();

  const signal =
    "timeout" in AbortSignal ? AbortSignal.timeout(TIMEOUT_MS) : undefined;

  const fetchJSON = async (url: URL) => {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal,
        headers: { accept: "application/json" },
      });
      if (!res.ok) return null;
      return await res.json().catch(() => null);
    } catch {
      return null;
    }
  };

  const [dictRaw, imgsRaw] = await Promise.all([
    fetchJSON(dictionary),
    fetchJSON(images),
  ]);

  const dict = Array.isArray(dictRaw) ? dictRaw : dictRaw ? [dictRaw] : [];

  const imgs = Array.isArray(imgsRaw?.photos)
    ? imgsRaw.photos
    : Array.isArray(imgsRaw)
    ? imgsRaw
    : [];

  return NextResponse.json(
    {
      dictionary: dict,
      images: imgs,
      query: word,
    },
    { status: 200 }
  );
}
