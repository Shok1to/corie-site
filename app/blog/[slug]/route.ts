import { renderPost } from "@/lib/blog-pages";
import { getPost, getPosts } from "@/lib/posts";

export const dynamic = "force-static";
// Unknown slugs 404 instead of rendering on demand.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  const post = getPost(slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(renderPost(post), {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
