import { readFile } from "node:fs/promises";
import path from "node:path";

// Serves the hand-written static page in site/index.html at "/".
// Rendered once at build time.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(path.join(process.cwd(), "site", "index.html"), "utf8");
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
