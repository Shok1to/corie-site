import { AUTHOR_IMAGE, AUTHOR_NAME, AUTHOR_TITLE, SITE_NAME, SITE_URL } from '@/lib/site';
import { formatPostDate, type Post } from '@/lib/posts';

const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** JSON for a <script> block: "<" is escaped so nothing can close the tag early. */
const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

const HEAD_ASSETS = `
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
    rel="stylesheet"
  />
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            ivory: "#FAF8F5", alabaster: "#F3EFE9", forest: "#1E352F", forestHover: "#29473F",
            gold: "#B5894C", goldLight: "#CFA86E", charcoal: "#1C1B19", stone: "#5C5852", hairline: "#E5DFD5",
          },
          fontFamily: {
            serif: ['"Cormorant Garamond"', "Georgia", "serif"],
            sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
          },
        },
      },
    };
  </script>
  <style>
    body { background-color: #FAF8F5; color: #1C1B19; font-family: "Plus Jakarta Sans", system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
    .font-editorial { font-family: "Cormorant Garamond", Georgia, serif; }
    .card-lift { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s cubic-bezier(.22,1,.36,1), border-color .25s ease; }
    .card-lift:hover { transform: translateY(-3px); box-shadow: 0 20px 38px -16px rgba(30,53,47,.12); }

    /* Article typography */
    .article { font-size: 1.0625rem; line-height: 1.8; color: #1C1B19; }
    .article > * + * { margin-top: 1.25rem; }
    .article h2 { font-family: "Cormorant Garamond", Georgia, serif; font-size: 2rem; line-height: 1.2; font-weight: 500; color: #1E352F; margin-top: 3rem; scroll-margin-top: 6rem; }
    .article h2 + * { margin-top: .9rem; }
    .article h3 { font-size: 1.15rem; line-height: 1.4; font-weight: 600; color: #1E352F; margin-top: 2.25rem; }
    .article h3 + * { margin-top: .6rem; }
    .article a { color: #1E352F; text-decoration: underline; text-decoration-color: #B5894C; text-underline-offset: 3px; text-decoration-thickness: 1.5px; }
    .article a:hover { color: #B5894C; }
    .article ul, .article ol { padding-left: 1.4rem; }
    .article ul { list-style: disc; }
    .article ol { list-style: decimal; }
    .article li + li { margin-top: .6rem; }
    .article li::marker { color: #B5894C; }
    .article strong { font-weight: 600; }
    .article .table-wrap { overflow-x: auto; border: 1px solid #E5DFD5; border-radius: 1rem; background: #fff; }
    .article table { width: 100%; border-collapse: collapse; font-size: .9375rem; line-height: 1.55; min-width: 34rem; }
    .article th { background: #F3EFE9; color: #1E352F; font-weight: 600; text-align: left; padding: .8rem 1rem; border-bottom: 1px solid #E5DFD5; }
    .article td { padding: .8rem 1rem; vertical-align: top; border-bottom: 1px solid #E5DFD5; }
    .article tr:last-child td, .article tr:last-child th { border-bottom: 0; }
    .article tbody th { background: #fff; font-weight: 600; vertical-align: top; }
    .article .note { background: #F3EFE9; border-left: 3px solid #B5894C; border-radius: .5rem; padding: 1rem 1.25rem; font-size: .9375rem; line-height: 1.65; color: #5C5852; }
    .article .sources { font-size: .875rem; line-height: 1.6; color: #5C5852; }
    .article .sources li + li { margin-top: .4rem; }
    .article .sources a { overflow-wrap: anywhere; }
  </style>`;

function header(active: 'blog'): string {
  const link = (href: string, label: string) =>
    `<a href="${href}" class="hover:text-ivory transition-colors">${label}</a>`;
  return `
  <header class="sticky top-0 z-40 bg-forest backdrop-blur-md border-b border-white/10">
    <div class="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center justify-between gap-3 sm:gap-4">
      <a href="/" class="flex items-center gap-2.5 sm:gap-3 group focus:outline-none">
        <img src="/assets/logo-mark-light.svg" alt="" width="36" height="40" class="h-8 sm:h-9 w-auto shrink-0" />
        <span class="flex flex-col">
          <span class="whitespace-nowrap font-editorial text-[21px] sm:text-[26px] font-medium tracking-tight text-ivory leading-none">Corie Anne<br class="sm:hidden" /> del Carmen</span>
          <span class="hidden sm:block sm:whitespace-nowrap text-[11px] uppercase tracking-[0.2em] text-[#B7CFCB] mt-1 font-semibold">delcarmen.ca · Financial Advisory</span>
        </span>
      </a>
      <nav aria-label="Primary Navigation" class="hidden xl:flex items-center gap-5 text-[13px] whitespace-nowrap text-ivory/75">
        ${link('/', 'Overview')}
        ${link('/#first-step', 'Where to Begin')}
        ${link('/#services', 'Four Disciplines')}
        ${link('/#products', 'Investment Products')}
        ${link('/#about', 'About &amp; Process')}
        ${link('/#faq', 'FAQ')}
      </nav>
      <div class="flex items-center gap-2.5">
        <a href="/blog" class="inline-flex items-center justify-center rounded-full bg-ivory px-3.5 sm:px-5 py-2.5 whitespace-nowrap text-xs sm:text-sm font-medium text-forest hover:bg-alabaster transition-colors shadow-sm"><span class="min-[380px]:hidden">Education</span><span class="hidden min-[380px]:inline">Financial Education</span></a>
        <button id="mobile-menu-btn" type="button" aria-label="Open Navigation Menu" aria-expanded="false" class="xl:hidden p-2.5 rounded-xl border border-white/25 text-ivory hover:bg-white/10">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
      </div>
    </div>
    <div id="mobile-menu" class="hidden xl:hidden border-t border-white/10 bg-forest px-6 py-5 space-y-2.5">
      <a href="/" class="block py-2 text-sm text-ivory/75 hover:text-ivory">Overview</a>
      <a href="/#first-step" class="block py-2 text-sm text-ivory/75 hover:text-ivory">Where to Begin</a>
      <a href="/#services" class="block py-2 text-sm text-ivory/75 hover:text-ivory">Four Disciplines</a>
      <a href="/#products" class="block py-2 text-sm text-ivory/75 hover:text-ivory">Investment Products</a>
      <a href="/#about" class="block py-2 text-sm text-ivory/75 hover:text-ivory">About &amp; Process</a>
      <a href="/#faq" class="block py-2 text-sm text-ivory/75 hover:text-ivory">FAQ</a>
    </div>
  </header>`;
}

const FOOTER = `
  <footer class="border-t border-white/10 bg-forest py-12">
    <div class="max-w-6xl mx-auto px-5 sm:px-8 space-y-6">
      <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span class="font-editorial text-2xl font-medium text-ivory">Corie Anne del Carmen</span>
          <p class="text-xs text-ivory/70 mt-1">delcarmen.ca · 205 Placer Court, North York, Ontario M2H 3H9 · +1 (647) 285-2662</p>
        </div>
        <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-ivory/75">
          <a href="/" class="hover:text-ivory transition-colors">Overview</a>
          <a href="/#services" class="hover:text-ivory transition-colors">Four Disciplines</a>
          <a href="/#products" class="text-ivory font-semibold hover:text-goldLight transition-colors">Investment Products</a>
          <a href="/blog" class="hover:text-ivory transition-colors">Blog</a>
          <a href="/#contact" class="hover:text-ivory transition-colors">Book Consultation</a>
        </div>
      </div>
      <div class="pt-5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] text-ivory/60 leading-relaxed">
        <p class="max-w-3xl"><strong>Educational Notice:</strong> Articles on delcarmen.ca are general information for educational purposes and do not constitute individualized financial, insurance, tax, legal, or investment advice.</p>
        <p class="whitespace-nowrap font-medium text-ivory/75">© 2026 Corie Anne del Carmen</p>
      </div>
    </div>
  </footer>
  <script>
    (function () {
      var btn = document.getElementById("mobile-menu-btn");
      var menu = document.getElementById("mobile-menu");
      btn.addEventListener("click", function () {
        var hidden = menu.classList.toggle("hidden");
        btn.setAttribute("aria-expanded", String(!hidden));
      });
    })();
  </script>`;

function page(opts: {
  title: string;
  description: string;
  path: string;
  type: 'website' | 'article';
  body: string;
  extraHead?: string;
}): string {
  const url = `${SITE_URL}${opts.path}`;
  return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(opts.title)}</title>
  <meta name="description" content="${esc(opts.description)}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="${opts.type}" />
  <meta property="og:site_name" content="${esc(SITE_NAME)}" />
  <meta property="og:title" content="${esc(opts.title)}" />
  <meta property="og:description" content="${esc(opts.description)}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary" />${opts.extraHead ?? ''}
  ${HEAD_ASSETS}
</head>
<body class="bg-ivory text-charcoal selection:bg-forest selection:text-ivory">
${header('blog')}
${opts.body}
${FOOTER}
</body>
</html>`;
}

export function renderBlogIndex(posts: Post[]): string {
  const title = `Blog | ${SITE_NAME}`;
  const description =
    'Plain-language articles on insurance, investing, estate and tax planning from Corie Anne del Carmen, a financial advisor in North York, Ontario.';

  const cards = posts
    .map(
      (p) => `
      <li>
        <a href="/blog/${p.slug}" class="card-lift group flex h-full flex-col rounded-2xl border border-hairline bg-white p-7 hover:border-gold">
          <div class="flex items-center justify-between gap-4 text-xs text-stone">
            <span class="flex items-center gap-3">
              <img src="${AUTHOR_IMAGE}" alt="" width="32" height="32" class="h-8 w-8 rounded-full object-cover object-top" />
              <span class="font-semibold text-charcoal">${esc(AUTHOR_NAME)}</span>
            </span>
            <span>${formatPostDate(p.date)} <span aria-hidden="true">/</span> ${p.readMinutes} min read</span>
          </div>
          <h2 class="mt-6 font-editorial text-[1.7rem] font-medium leading-tight text-forest">${esc(p.title)}</h2>
          <p class="mt-3 text-sm leading-relaxed text-stone">${esc(p.description)}</p>
          <span class="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-semibold text-forest group-hover:text-gold transition-colors">Read article <span aria-hidden="true">→</span></span>
        </a>
      </li>`,
    )
    .join('\n');

  const body = `
  <main>
    <section class="py-16 sm:py-20 border-b border-hairline">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <p class="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">Blog</p>
        <h1 class="mt-3 font-editorial text-4xl sm:text-5xl font-medium leading-tight text-forest max-w-3xl">Clear thinking on money, in plain language.</h1>
        <p class="mt-5 max-w-2xl text-base sm:text-lg text-stone leading-relaxed">${esc(description)}</p>
      </div>
    </section>
    <section class="py-14 sm:py-16">
      <div class="max-w-6xl mx-auto px-5 sm:px-8">
        <ul class="grid gap-6 md:grid-cols-2">${cards}
        </ul>
      </div>
    </section>
  </main>`;

  return page({
    title,
    description,
    path: '/blog',
    type: 'website',
    body,
    extraHead: `\n  <script type="application/ld+json">${jsonLd({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `${SITE_NAME} Blog`,
      url: `${SITE_URL}/blog`,
      description,
    })}</script>`,
  });
}


// Official brand marks (Simple Icons, 24x24 viewBox).
const CHATGPT_ICON = `<svg viewBox="0 0 24 24" class="h-5 w-5 text-charcoal" fill="currentColor" aria-hidden="true"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/></svg>`;

const CLAUDE_ICON = `<svg viewBox="0 0 24 24" class="h-5 w-5" fill="#D97757" aria-hidden="true"><path d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/></svg>`;

const geminiIcon = (id: string) => `<svg viewBox="0 0 24 24" class="h-5 w-5" aria-hidden="true"><defs><linearGradient id="${id}" x1="2" y1="20" x2="22" y2="4" gradientUnits="userSpaceOnUse"><stop stop-color="#1C7DFF"/><stop offset="0.55" stop-color="#4B90FF"/><stop offset="1" stop-color="#D96570"/></linearGradient></defs><path fill="url(#${id})" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/></svg>`;

/** "Read with ChatGPT / Claude / AI Mode": each opens the assistant with a prompt to read this article. */
/** `suffix` keeps the gradient id unique: the page renders this block twice (phone and desktop). */
function readWithAI(post: Post, url: string, suffix: string): string {
  const prompt = encodeURIComponent(
    `Read ${url} and summarize "${post.title}". I may ask follow-up questions about it, and please cite ${AUTHOR_NAME} (delcarmen.ca) as the source.`,
  );
  const links = [
    { label: 'Read with ChatGPT', href: `https://chatgpt.com/?q=${prompt}`, icon: CHATGPT_ICON },
    { label: 'Read with Claude', href: `https://claude.ai/new?q=${prompt}`, icon: CLAUDE_ICON },
    { label: 'Read with AI Mode', href: `https://www.google.com/search?udm=50&q=${prompt}`, icon: geminiIcon(`gemini-fill-${suffix}`) },
  ];
  return `<ul class="space-y-3">${links
    .map(
      (l) => `
            <li><a href="${l.href}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-3 rounded-xl border border-hairline bg-white px-4 py-3 text-sm font-medium text-charcoal transition-colors hover:border-gold">${l.icon}${l.label}</a></li>`,
    )
    .join('')}
          </ul>`;
}

export function renderPost(post: Post): string {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const tocLinks = post.headings
    .map(
      (h, i) =>
        `<li><a href="#${h.id}" data-toc="${h.id}" class="toc-link block border-l-2 border-transparent py-2 pl-4 text-stone hover:text-forest transition-colors">${i + 1}. ${esc(h.text)}</a></li>`,
    )
    .join('');
  const aiMobile = readWithAI(post, url, 'm');
  const aiDesktop = readWithAI(post, url, 'd');

  const body = `
  <main>
    <article>
      <header class="py-14 sm:py-16 border-b border-hairline bg-alabaster/50">
        <div class="max-w-6xl mx-auto px-5 sm:px-8">
          <a href="/blog" class="text-xs font-semibold uppercase tracking-[0.18em] text-gold hover:text-forest transition-colors">← Blog</a>
          <h1 class="mt-4 max-w-4xl font-editorial text-4xl sm:text-[2.9rem] font-medium leading-[1.1] text-forest text-balance">${esc(post.title)}</h1>
          <div class="mt-7 flex items-center gap-3.5">
            <img src="${AUTHOR_IMAGE}" alt="${esc(AUTHOR_NAME)}" width="44" height="44" class="h-11 w-11 rounded-full object-cover object-top" />
            <div class="text-sm leading-snug">
              <p class="font-semibold text-charcoal">${esc(AUTHOR_NAME)} <span class="font-normal text-stone">· ${esc(AUTHOR_TITLE)}</span></p>
              <p class="text-stone">${formatPostDate(post.date)} <span aria-hidden="true">/</span> ${post.readMinutes} min read</p>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-12 sm:py-14">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,44rem)_17rem] lg:justify-between">
          <div class="min-w-0">
            <!-- Phone and tablet: the sidebar content sits above the article -->
            <div class="lg:hidden mb-10 space-y-6">
              ${aiMobile}
              <nav aria-label="In this article" class="rounded-2xl border border-hairline bg-white px-6 py-5">
                <p class="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">In this article</p>
                <ul class="mt-2 text-sm">${post.headings
                  .map(
                    (h, i) =>
                      `<li><a href="#${h.id}" class="block py-1 text-stone hover:text-forest transition-colors">${i + 1}. ${esc(h.text)}</a></li>`,
                  )
                  .join('')}</ul>
              </nav>
            </div>

            <div class="article">
${post.html}
            </div>

            <aside class="mt-14 rounded-2xl bg-forest text-ivory p-7 sm:p-9">
              <p class="font-editorial text-3xl leading-tight">Want a calm look at where you stand?</p>
              <p class="mt-3 text-sm sm:text-base text-ivory/80 leading-relaxed">Your initial discovery consultation is complimentary, with no obligation and no products pitched.</p>
              <a href="/#contact" class="mt-6 inline-flex items-center justify-center rounded-full bg-ivory px-6 py-3 text-sm font-medium text-forest hover:bg-alabaster transition-colors">Book a Consultation</a>
            </aside>
            <p class="mt-8"><a href="/blog" class="text-sm font-semibold text-forest hover:text-gold transition-colors">← Back to all articles</a></p>
          </div>

          <!-- Desktop: sticky sidebar -->
          <aside class="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            ${aiDesktop}
            <nav aria-label="Table of contents" class="mt-9">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal">Table of contents</p>
              <ul class="mt-4 border-l border-hairline text-sm leading-snug">${tocLinks}</ul>
            </nav>
          </aside>
        </div>
      </div>
    </article>
  </main>
  <script>
    // Highlights the section being read in the table of contents.
    (function () {
      var links = document.querySelectorAll(".toc-link");
      if (!links.length || !("IntersectionObserver" in window)) return;
      var byId = {};
      links.forEach(function (a) { byId[a.getAttribute("data-toc")] = a; });
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          links.forEach(function (a) { a.classList.remove("border-forest", "text-forest", "font-medium"); a.classList.add("border-transparent"); });
          var a = byId[e.target.id];
          if (a) { a.classList.remove("border-transparent"); a.classList.add("border-forest", "text-forest", "font-medium"); }
        });
      }, { rootMargin: "-100px 0px -65% 0px" });
      document.querySelectorAll(".article h2[id]").forEach(function (h) { obs.observe(h); });
    })();
  </script>`;

  return page({
    title: `${post.title} | ${SITE_NAME}`,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: 'article',
    body,
    extraHead: `
  <meta property="article:published_time" content="${post.date}" />
  <meta property="article:author" content="${esc(AUTHOR_NAME)}" />
  <script type="application/ld+json">${jsonLd({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: url,
    author: { '@type': 'Person', name: AUTHOR_NAME, jobTitle: AUTHOR_TITLE, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  })}</script>`,
  });
}
