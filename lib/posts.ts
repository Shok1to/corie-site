import fs from 'node:fs';
import path from 'node:path';

export interface PostHeading {
  id: string;
  text: string;
}

export interface Post {
  slug: string;
  title: string;
  description: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Article HTML with an id on every h2. */
  html: string;
  headings: PostHeading[];
  readMinutes: number;
}

const WORDS_PER_MINUTE = 200;

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/&amp;/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const stripTags = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&');

type Meta = Pick<Post, 'slug' | 'title' | 'description' | 'date'> & {
  /** Only when the author states a reading time; otherwise it is counted from the text. */
  readMinutes?: number;
};

function loadPost(meta: Meta, file: string): Post {
  const raw = fs.readFileSync(path.join(process.cwd(), 'lib/posts', file), 'utf8');

  const headings: PostHeading[] = [];
  const html = raw.replace(/<h2>(.*?)<\/h2>/g, (_, inner: string) => {
    const text = stripTags(inner).replace(/\s+/g, ' ').trim();
    const id = slugify(text);
    headings.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });

  // The sources list is reference material, not reading time.
  const readable = raw.split('<h2>Sources</h2>')[0];
  const words = stripTags(readable).split(/\s+/).filter(Boolean).length;
  const counted = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return { ...meta, html, headings, readMinutes: meta.readMinutes ?? counted };
}

/**
 * To add an article: drop its HTML into lib/posts/ (h2 headings, no h1), then
 * add one entry here. Newest first.
 */
export function getPosts(): Post[] {
  return [
    loadPost(
      {
        slug: 'building-wealth-is-only-half-the-plan',
        title: 'Building Wealth Is Only Half the Plan: Why Protecting It Comes First',
        description:
          'Most conversations about personal finance start with growing your money. Far fewer ask what keeps that plan intact if life interrupts your ability to earn, and why protection should come first.',
        date: '2026-11-24',
        readMinutes: 5, // as stated in the author's draft
      },
      'building-wealth-is-only-half-the-plan.html',
    ),
    loadPost(
      {
        slug: 'when-the-paycheque-stops',
        title: "When the Paycheque Stops: Why GoFundMe Isn't a Financial Plan",
        description:
          'Most of us plan for retirement. Far fewer plan for the day income stops early. How likely it is, what public programs actually pay, and why protection often costs less than people expect.',
        date: '2026-11-17',
      },
      'when-the-paycheque-stops.html',
    ),
  ];
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
