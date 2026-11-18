import { renderBlogIndex } from "@/lib/blog-pages";
import { getPosts } from "@/lib/posts";

// Built once at deploy time, like the home page.
export const dynamic = "force-static";

export async function GET() {
  return new Response(renderBlogIndex(getPosts()), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
