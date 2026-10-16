import Image from "next/image";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#team", label: "Team" },
  { href: "#process", label: "Process" },
  { href: "#faq", label: "FAQ" },
];

const stats = [
  { num: "10+", label: "Years in practice" },
  { num: "Four", label: "Core planning disciplines" },
  { num: "1", label: "Coordinated plan" },
  { num: "Team", label: "Specialists on call" },
];

const pillars = [
  {
    num: "01",
    title: "Clarity first",
    body: "We map your income, obligations, goals, and risk tolerance in plain language so every decision connects to something you care about.",
  },
  {
    num: "02",
    title: "Integrated planning",
    body: "Investments, insurance, tax, and estate decisions affect one another. We design them together so nothing works against something else.",
  },
  {
    num: "03",
    title: "Ongoing stewardship",
    body: "Markets, tax law, and family circumstances change. We review your plan regularly and adjust it deliberately, not reactively.",
  },
];

const services = [
  {
    icon: "I",
    title: "Investments",
    body: "A diversified, goal-based portfolio built around your time horizon, cash flow needs, and comfort with volatility.",
    items: [
      "Goal-based portfolio design",
      "Retirement income planning",
      "Registered account strategy (RRSP, TFSA, and workplace plans)",
      "Regular rebalancing and performance review",
    ],
  },
  {
    icon: "P",
    title: "Insurance",
    body: "Protection sized to what your family would actually need, so a single event does not undo years of progress.",
    items: [
      "Life and disability income protection",
      "Critical illness coverage",
      "Needs analysis and policy review",
      "Business and key-person protection",
    ],
  },
  {
    icon: "E",
    title: "Estate Planning",
    body: "A clear plan for what happens to your assets, your family, and your wishes, arranged to minimize confusion and delay.",
    items: [
      "Wills and beneficiary designations",
      "Powers of attorney and personal directives",
      "Guardianship and family considerations",
      "Coordination with your legal counsel",
    ],
  },
  {
    icon: "T",
    title: "Tax Planning",
    body: "Proactive strategies that keep more of what you earn and grow working for you, across your working years and into retirement.",
    items: [
      "Income and withdrawal sequencing",
      "Tax-efficient investment location",
      "Business owner and incorporated professional planning",
      "Coordination with your accountant",
    ],
  },
];

const team = [
  {
    title: "Investment Strategists",
    role: "Portfolio construction",
    body: "Specialists in asset allocation, fund selection, and risk management for every stage of life.",
  },
  {
    title: "Insurance Specialists",
    role: "Protection planning",
    body: "Experienced in individual, group, and business coverage, with a focus on matching protection to real needs.",
  },
  {
    title: "Estate & Legal Partners",
    role: "Trusts and wills",
    body: "Trusted lawyers and estate professionals who draft documents and handle complex family or cross-border matters.",
  },
  {
    title: "Tax Professionals",
    role: "Tax strategy",
    body: "Chartered accountants and tax specialists who review structures, filings, and the tax impact of major decisions.",
  },
  {
    title: "Retirement Planners",
    role: "Income in later life",
    body: "Specialists who model how your savings will support you for decades, including pensions, benefits, and drawdown.",
  },
  {
    title: "Business Advisors",
    role: "Owners and succession",
    body: "Advisors who help business owners plan for succession, buy-sell agreements, and exit strategies.",
  },
];

const steps = [
  {
    num: "01",
    title: "Discover",
    body: "We talk about your goals, your family, your current situation, and what keeps you up at night.",
  },
  {
    num: "02",
    title: "Assess",
    body: "We review your finances, protection, tax position, and estate documents to see where you stand today.",
  },
  {
    num: "03",
    title: "Design",
    body: "You receive a written plan with recommendations, the reasoning behind them, and the trade-offs involved.",
  },
  {
    num: "04",
    title: "Steward",
    body: "We implement the plan, then review it regularly so it keeps pace with your life and the world around it.",
  },
];

const faqs = [
  {
    q: "What does financial independence mean to you?",
    a: "It means having enough financial resources and flexibility that you can make choices about your work, time, and priorities without being forced by money. Everyone's definition is different, and that is where planning begins.",
  },
  {
    q: "Do I need a lot of assets to work with you?",
    a: "No. Many clients come to me early in their careers or at a point of change. What matters is having a goal and a willingness to plan for it. [Add any minimum asset or fee information, if applicable.]",
  },
  {
    q: "Can you handle everything, or do I need other professionals?",
    a: "I coordinate the full picture and bring in specialists in law, tax, and specific insurance or investment areas when needed. You work with one trusted advisor and get access to a team behind that advisor.",
  },
  {
    q: "How are you compensated?",
    a: "[Describe your fee model clearly, for example fee-only, fee-based, commission, or a combination. Clients should always know how and what they pay.]",
  },
  {
    q: "How often will we review my plan?",
    a: "Most clients meet at least annually, with check-ins when major life events occur, such as a new job, a marriage, a home purchase, a birth, or a change in health.",
  },
];

export default function Home() {
  return (
    <>
      <header>
        <div className="container nav">
          <a href="#top" className="brand">
            Corie Anne <span>del Carmen</span>
          </a>
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
          <a href="#contact" className="btn btn-primary nav-cta">
            Book a consultation
          </a>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="eyebrow">Personal Financial Independence</span>
              <h1>
                Building a life where <em>money works</em> for you, not the other way around.
              </h1>
              <p className="lead">
                I help individuals and families design a clear, durable path to financial
                independence through thoughtful investing, the right protection, and plans for
                both your estate and your taxes. Over a decade of practice, one principle has
                guided every client: a good plan should give you choices.
              </p>
              <div className="hero-actions">
                <a href="#contact" className="btn btn-primary">
                  Book a consultation
                </a>
                <a href="#services" className="btn btn-outline">
                  Explore services
                </a>
              </div>
            </div>
            <div className="hero-photo">
              <Image
                src="/assets/corie-anne-del-carmen.jpg"
                alt="Corie Anne del Carmen, financial advisor"
                fill
                priority
                sizes="(max-width: 860px) 420px, 480px"
              />
            </div>
          </div>
        </section>

        {/* CREDIBILITY STRIP */}
        <div className="strip">
          <div className="container strip-grid">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="strip-num">{s.num}</div>
                <div className="strip-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* PHILOSOPHY */}
        <section className="philosophy">
          <div className="container">
            <span className="eyebrow">Our philosophy</span>
            <h2>
              Independence is not a number. It is the freedom to decide how you spend your time.
            </h2>
            <p className="lead">
              Many people chase a balance sheet target without asking what it is for. I start with
              what you want your life to look like, then work backward to the investments,
              protection, and structures that make it possible.
            </p>
            <div className="pillars">
              {pillars.map((p) => (
                <div className="pillar" key={p.num}>
                  <div className="num">{p.num}</div>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="services">
          <div className="container">
            <span className="eyebrow">What we do</span>
            <h2>Four disciplines. One coordinated plan.</h2>
            <p className="lead">
              Each area can stand on its own, but the greatest gains usually come from seeing them
              together.
            </p>
            <div className="services-grid">
              {services.map((s) => (
                <article className="service" key={s.title}>
                  <div className="service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                  <ul>
                    {s.items.map((i) => (
                      <li key={i}>{i}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* TEAM */}
        <section className="team" id="team">
          <div className="container">
            <span className="eyebrow">Our team</span>
            <h2>Specialists when your situation calls for them.</h2>
            <p className="lead team-intro">
              You do not need to become an expert in every area. When a question goes beyond my
              day-to-day focus, I bring in the right specialist and keep the whole plan
              coordinated.
            </p>
            <div className="team-grid">
              {team.map((t) => (
                <div className="team-card" key={t.title}>
                  <h3>{t.title}</h3>
                  <div className="team-role">{t.role}</div>
                  <p>{t.body}</p>
                </div>
              ))}
            </div>
            <div className="team-note">
              <strong>How it works:</strong> I remain your single point of contact. You get one
              coordinated plan and one conversation, with access to specialist expertise whenever
              it is needed.
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="about" id="about">
          <div className="container about-grid">
            <div>
              <span className="eyebrow">About Corie</span>
              <h2>A decade of guiding people through the decisions that matter most.</h2>
            </div>
            <div>
              <p>
                Over more than ten years in financial services, I have worked with people at every
                stage: early-career professionals building their first savings plan, parents
                protecting their families, and retirees turning decades of saving into dependable
                income.
              </p>
              <p>
                My approach is patient and practical. I prefer clear recommendations, transparent
                fees, and conversations that leave you better informed than when you arrived. The
                goal is not to make every decision for you. It is to make sure you are deciding
                with confidence.
              </p>
              <ul className="creds">
                <li>
                  <span>Credentials</span> [Add designations, e.g. CFP®, CLU®, CHS®, licensing
                  details]
                </li>
                <li>
                  <span>Years in practice</span> 10+ years
                </li>
                <li>
                  <span>Registration</span> [Add regulator and registration number]
                </li>
                <li>
                  <span>Community</span> [Add professional memberships or volunteer work, if
                  applicable]
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS */}
        <section className="process" id="process">
          <div className="container">
            <span className="eyebrow">How we work</span>
            <h2>A straightforward path from first conversation to ongoing guidance.</h2>
            <div className="steps">
              {steps.map((s) => (
                <div className="step" key={s.num}>
                  <div className="step-num">{s.num}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="faq" id="faq">
          <div className="container faq-wrap">
            <span className="eyebrow" style={{ textAlign: "center" }}>
              Common questions
            </span>
            <h2>Good questions deserve clear answers.</h2>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section className="contact" id="contact">
          <div className="container contact-grid">
            <div>
              <span className="eyebrow">Start the conversation</span>
              <h2>Let&apos;s talk about the life you want to build.</h2>
              <p>
                Book a no-obligation consultation to explore where you are today and what a clear
                plan could look like. There is no pressure, and no product to sell in the first
                meeting.
              </p>
              <ul className="contact-details">
                <li>
                  <strong>Phone</strong> <a href="tel:+16472852662">+1 (647) 285-2662</a>
                </li>
                <li>
                  <strong>Email</strong> <a href="mailto:corie@delcarmen.ca">corie@delcarmen.ca</a>
                </li>
                <li>
                  <strong>Website</strong> <a href="https://delcarmen.ca">delcarmen.ca</a>
                </li>
                <li>
                  <strong>Office</strong> 205 Placer Court, North York, Ontario M2H 3H9
                </li>
                <li>
                  <strong>Hours</strong> [Add business hours]
                </li>
              </ul>
            </div>

            <form action="mailto:corie@delcarmen.ca" method="post" encType="text/plain">
              <h3>Request a consultation</h3>
              <p className="hint">
                Share a little about yourself and I will be in touch within one business day.
              </p>

              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" type="text" autoComplete="name" required />
              </div>
              <div className="field">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" autoComplete="email" required />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone (optional)</label>
                <input id="phone" name="phone" type="tel" autoComplete="tel" />
              </div>
              <div className="field">
                <label htmlFor="interest">What are you most interested in?</label>
                <select id="interest" name="interest">
                  <option>Financial independence planning</option>
                  <option>Investments</option>
                  <option>Insurance</option>
                  <option>Estate planning</option>
                  <option>Tax planning</option>
                  <option>Not sure yet</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="message">Anything you would like me to know?</label>
                <textarea id="message" name="message" />
              </div>
              <button type="submit" className="btn btn-primary">
                Send request
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4>Corie Anne del Carmen</h4>
              <p>
                Helping individuals and families pursue personal financial independence through
                investments, insurance, estate planning, and tax planning.
              </p>
            </div>
            <div>
              <h4>Explore</h4>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#services">Services</a></li>
                <li><a href="#team">Our team</a></li>
                <li><a href="#process">How we work</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4>Connect</h4>
              <ul>
                <li><a href="#contact">Book a consultation</a></li>
                <li><a href="tel:+16472852662">+1 (647) 285-2662</a></li>
                <li><a href="mailto:corie@delcarmen.ca">corie@delcarmen.ca</a></li>
                <li><a href="https://delcarmen.ca">delcarmen.ca</a></li>
                <li><a href="#">[LinkedIn]</a></li>
                <li><a href="#">[Privacy policy]</a></li>
              </ul>
            </div>
          </div>
          <div className="disclaimer">
            The information on this website is general in nature and is provided for educational
            purposes only. It does not constitute personalized investment, insurance, legal, or tax
            advice. Investments involve risk, including the possible loss of principal, and past
            performance is not a guarantee of future results. Insurance products are subject to
            underwriting and policy terms. Please consult a qualified professional before making
            financial decisions. [Add registration, regulatory, and disclosure statements required
            in your jurisdiction.]
            <br />
            <br />
            &copy; 2026 Corie Anne del Carmen. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
