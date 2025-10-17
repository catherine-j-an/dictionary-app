import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const word = (searchParams.get("word") || "").trim();
  const key = "bf84c5dt8ba6f1571of07a1c8e407cf3";

  if (!word) {
    return NextResponse.json(
      { error: "Missing 'word' param" },
      { status: 400 }
    );
  }

  const upstream = `https://api.shecodes.io/dictionary/v1/define?word=${encodeURIComponent(
    word
  )}&key=${key}`;

  const ac = new AbortController();
  const timeout = setTimeout(() => ac.abort(), 8000);

  try {
    const res = await fetch(upstream, {
      cache: "no-store",
      signal: ac.signal,
      headers: {
        accept: "application/json",
        "user-agent": "nextjs-proxy/1.0 (+https://localhost)",
      },
    });

    clearTimeout(timeout);

    const data = await res.json().catch(() => ({}));

    return NextResponse.json(data, { status: res.status });
  } catch (e: any) {
    clearTimeout(timeout);

    console.error("[/api/define] upstream error:", e?.name, e?.message);

    return NextResponse.json(
      { error: "Upstream request failed", detail: e?.message || String(e) },
      { status: 502 }
    );
  }
}
