import { NextResponse } from "next/server";
import { z } from "zod";

// --- Schema & Types ---
const RequestSchema = z.object({
  method: z.string(),
  options: z.unknown().optional(),
});
type RequestBody = z.infer<typeof RequestSchema>;

// --- Handler ---
export async function POST(request: Request) {
  let body: RequestBody;

  try {
    const json = await request.json();
    body = RequestSchema.parse(json);
  } catch (error) {
    const details = error instanceof z.ZodError ? error.issues : String(error);
    return NextResponse.json(
      {
        ok: false,
        status: 400,
        data: { error: "Invalid request body", details },
      },
      { status: 400 },
    );
  }

  const { method, options } = body;

  // --- Local-only smoke test ---
  if (process.env.NODE_ENV !== "production" && method === "__ping") {
    return NextResponse.json({ ok: true, status: 200, data: { pong: true } }, { status: 200 });
  }

  const base = process.env.SWS_API_BASE;
  const apiKey = process.env.SWS_API_KEY;

  if (!base || !apiKey) {
    return NextResponse.json(
      { ok: false, status: 500, data: { error: "SWS API not configured" } },
      { status: 500 },
    );
  }

  const url = `${base.replace(/\/+$/, "")}/${encodeURIComponent(method)}`;

  try {
    // --- construir el body dinámico ---
    const payload: { api_key: string; options?: unknown } = { api_key: apiKey };
    if (options && typeof options === "object" && Object.keys(options as object).length > 0) {
      payload.options = options;
    }

    if (process.env.NODE_ENV !== "production") {
      const redacted = { ...payload, api_key: "***" };
      console.log(`[sws] request → ${method}`, redacted);
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const status = res.status;
    const text = await res.text();
    let data: unknown = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }

    // Debug logging (safe): status and a small preview of upstream body
    if (process.env.NODE_ENV !== "production") {
      const preview = typeof text === "string" ? text.slice(0, 200) : String(text).slice(0, 200);
      console.log(`[sws] ${method} → status=${status} body[0..200]=`, preview);
    }

    // --- logueo útil en desarrollo ---
    if (!res.ok) {
      console.error("SWS error", status);
    }

    return NextResponse.json({ ok: res.ok, status, data }, { status });
  } catch {
    return NextResponse.json(
      { ok: false, status: 502, data: { error: "Upstream request failed" } },
      { status: 502 },
    );
  }
}
