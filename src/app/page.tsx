import Image from "next/image";

import { RegisterForm } from "@/components/register-form";
import { videos } from "@/data/videos";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const sectionCard =
  "bg-card border border-hairline rounded-card p-[clamp(24px,3vw,48px)]";
const sectionHeading =
  "m-0 text-[clamp(24px,2.6vw,32px)] font-semibold tracking-[-0.01em] text-brand-teal";
const bodyCopy = "m-0 text-base leading-[1.75] text-body text-pretty";
const cardLabel =
  "font-mono text-[9.5px] tracking-[0.14em] uppercase text-brand-teal";

/**
 * Art direction carried over from the Claude Design export, whose `<image-slot>`
 * elements were all still empty — no artwork was ever attached to the project.
 * Keyed by the webinar ids in `videos.ts`.
 */
const thumbnailBriefs: Record<string, string> = {
  "seo-world-run-by-machines":
    'THUMBNAIL 1280×720 — robot at a bank of monitors, one screen reading "SEO" with a rising orange bar chart',
  "travel-disrupted":
    'THUMBNAIL 1280×720 — robot in an airport terminal, departures board reading "DELAYED / CANCELLED" in orange, aircraft overhead',
  "real-estate":
    "THUMBNAIL 1280×720 — robot facing a city skyline of high-rise towers at sunset, warm orange sky",
};

/**
 * Stands in for an export image slot we have no file for. It renders the slot's
 * own art direction so the layout is complete and the gap stays obvious.
 */
function ImageSlot({ description }: { description: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card-2 px-6 text-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="#4a4a4a" strokeWidth="1.5" />
        <circle cx="8.5" cy="10" r="1.5" stroke="#4a4a4a" strokeWidth="1.5" />
        <path d="M4 17l5-5 4 4 3-2 4 4" stroke="#4a4a4a" strokeWidth="1.5" />
      </svg>
      <p className="m-0 max-w-[46ch] text-[11.5px] leading-[1.5] text-[#6b6b6b] text-pretty">
        {description}
      </p>
    </div>
  );
}

function PlayButton() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95">
        <div className="ml-1 h-0 w-0 border-y-[9px] border-l-[15px] border-y-transparent border-l-black" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero dashboard cards                                                */
/* ------------------------------------------------------------------ */

const statCard =
  "bg-card-2 border border-hairline rounded-card p-3.5 flex flex-col";

function HeroDashboard() {
  return (
    <div className="relative grid grid-cols-[repeat(auto-fit,minmax(168px,1fr))] gap-3">
      {/* AI Search Insights */}
      <div className={`${statCard} gap-2`}>
        <div className={cardLabel}>AI Search Insights</div>
        <div className="text-[26px] font-bold tracking-[-0.02em] text-brand-orange">24,568</div>
        <div className="text-[10.5px] text-[#8a8a8a]">AI searches</div>
        <svg viewBox="0 0 120 30" preserveAspectRatio="none" className="h-[26px] w-full" aria-hidden>
          <polyline
            points="0,24 15,20 30,22 45,14 60,17 75,9 90,12 105,5 120,7"
            fill="none"
            stroke="#F2681C"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Top AI Search Queries */}
      <div className={`${statCard} gap-2.5`}>
        <div className={cardLabel}>Top AI Search Queries</div>
        <div className="flex flex-col gap-[7px]">
          {[
            { label: "1. Your Brand", width: "92%", color: "#F2681C", strong: true },
            { label: "2. Competitor A", width: "68%", color: "#7a3d15", strong: false },
            { label: "3. Competitor B", width: "47%", color: "#7a3d15", strong: false },
            { label: "4. Competitor C", width: "31%", color: "#7a3d15", strong: false },
          ].map((row) => (
            <div key={row.label} className="flex flex-col gap-[3px]">
              <div className={`text-[10.5px] ${row.strong ? "text-white" : "text-body"}`}>
                {row.label}
              </div>
              <div className="h-[5px] rounded-sm bg-[#1e1e1e]">
                <div
                  className="h-full rounded-sm"
                  style={{ width: row.width, background: row.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Visibility Score */}
      <div className={`${statCard} gap-2`}>
        <div className={cardLabel}>AI Visibility Score</div>
        <div className="flex items-baseline gap-2">
          <div className="text-[26px] font-bold tracking-[-0.02em] text-brand-orange">62%</div>
          <div className="text-[10px] text-[#8a8a8a]">vs. last 30 days</div>
        </div>
        <div className="flex h-[38px] items-end gap-[5px]">
          {[
            { height: "34%", color: "#4a2611" },
            { height: "46%", color: "#6b3413" },
            { height: "58%", color: "#8f4415" },
            { height: "70%", color: "#c15718" },
            { height: "86%", color: "#F2681C" },
            { height: "100%", color: "#F2681C" },
          ].map((bar, index) => (
            <div
              key={index}
              className="flex-1"
              style={{ height: bar.height, background: bar.color }}
            />
          ))}
        </div>
      </div>

      {/* Sources That Drive Discovery */}
      <div className={`${statCard} gap-2.5`}>
        <div className={cardLabel}>Sources That Drive Discovery</div>
        <div className="flex flex-col gap-2">
          {[
            { label: "Media Mentions", width: "90%", color: "#F2681C" },
            { label: "Reviews & Ratings", width: "74%", color: "#F2681C" },
            { label: "Business Directories", width: "58%", color: "#3DD9A9" },
            { label: "Expert Content", width: "44%", color: "#3DD9A9" },
            { label: "Third-Party Blogs", width: "30%", color: "#6b6b6b" },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-2">
              <span
                className="h-[5px] w-[5px] flex-none rounded-full"
                style={{ background: row.color }}
              />
              <span className="flex-1 text-[10.5px] text-body">{row.label}</span>
              <span className="block h-1 w-[34px] bg-[#1e1e1e]">
                <span className="block h-full" style={{ width: row.width, background: row.color }} />
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Mentions */}
      <div className={`${statCard} gap-2.5`}>
        <div className={cardLabel}>Brand Mentions</div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-[58px] w-[58px] flex-none items-center justify-center rounded-full"
            style={{
              background:
                "conic-gradient(#F2681C 0 42%,#c15718 42% 66%,#3DD9A9 66% 86%,#3a3a3a 86% 100%)",
            }}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card-2 text-sm font-bold">
              128
            </div>
          </div>
          <div className="flex flex-col gap-1 text-[9.5px] text-body">
            {[
              { label: "News & Media", color: "#F2681C" },
              { label: "Reviews", color: "#c15718" },
              { label: "Social & Forums", color: "#3DD9A9" },
              { label: "Blogs & Sites", color: "#3a3a3a" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5" style={{ background: row.color }} />
                {row.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What AI Is Looking At */}
      <div className={`${statCard} gap-2.5`}>
        <div className={cardLabel}>What AI Is Looking At</div>
        <div className="flex flex-col gap-[9px]">
          {[
            "Authoritative Mentions",
            "Positive Sentiment",
            "Strong Citations",
            "Verified Information",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2 text-[10.5px] text-body">
              <span className="text-xs leading-none text-brand-teal">&#10003;</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Search Growth Trend */}
      <div className={`${statCard} gap-2`}>
        <div className={cardLabel}>Search Growth Trend</div>
        <div className="flex items-baseline gap-[7px]">
          <div className="text-[26px] font-bold tracking-[-0.02em] text-brand-orange">3.2x</div>
          <div className="text-[10px] text-[#8a8a8a]">higher</div>
        </div>
        <svg viewBox="0 0 120 44" preserveAspectRatio="none" className="h-[42px] w-full" aria-hidden>
          <polyline
            points="0,40 20,36 40,30 60,25 80,15 100,11 120,3"
            fill="none"
            stroke="#3DD9A9"
            strokeWidth="2"
          />
          <polyline
            points="0,42 20,40 40,38 60,36 80,33 100,31 120,28"
            fill="none"
            stroke="#3a3a3a"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Audience Engagement */}
      <div className={`${statCard} gap-2.5`}>
        <div className={cardLabel}>Audience Engagement</div>
        <div className="flex items-center gap-3">
          <div
            className="flex h-[52px] w-[52px] flex-none items-center justify-center rounded-full"
            style={{ background: "conic-gradient(#3DD9A9 0 87%,#242424 87% 100%)" }}
          >
            <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-card-2 text-xs font-bold text-brand-teal">
              87%
            </div>
          </div>
          <div className="flex h-10 flex-1 items-end gap-1">
            {[
              { height: "52%", color: "#2f6d59" },
              { height: "74%", color: "#2f6d59" },
              { height: "44%", color: "#2f6d59" },
              { height: "88%", color: "#3DD9A9" },
              { height: "66%", color: "#2f6d59" },
            ].map((bar, index) => (
              <div
                key={index}
                className="flex-1"
                style={{ height: bar.height, background: bar.color }}
              />
            ))}
          </div>
        </div>
        <div className="text-[10px] text-[#8a8a8a]">Engagement rate</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Home() {
  return (
    <main className="w-full bg-bg text-white px-[clamp(16px,5vw,120px)] pt-[clamp(28px,4vw,64px)]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-[clamp(20px,2.4vw,32px)]">
        {/* ---------------------------------------------------------- Hero */}
        <section className="grid grid-cols-[repeat(auto-fit,minmax(330px,1fr))] items-start gap-[clamp(28px,4vw,56px)] pt-[clamp(8px,2vw,24px)] pb-[clamp(16px,2vw,28px)]">
          <div className="flex max-w-[620px] flex-col gap-[22px]">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-body">
              <span>John Rose</span>
              <span className="text-brand-orange">|</span>
              <span>Samson Ogbu</span>
            </div>

            <h1 className="m-0 flex flex-wrap items-center gap-x-[0.24em] text-[clamp(44px,5.4vw,78px)] font-bold uppercase leading-[0.94] tracking-[-0.02em]">
              <span className="whitespace-nowrap">PR FOR</span>
              <span className="inline-flex items-center whitespace-nowrap">
                <span>R</span>
                {/* Robot head standing in for the second O */}
                <span className="relative mx-[0.04em] inline-flex h-[0.72em] w-[0.72em] items-end justify-center">
                  <span className="absolute -top-[0.16em] left-1/2 h-[0.16em] w-0.5 bg-brand-orange" />
                  <span className="absolute -top-[0.22em] left-1/2 h-[0.12em] w-[0.12em] -translate-x-1/2 rounded-full bg-brand-orange" />
                  <span className="flex h-[0.6em] w-full items-center justify-center gap-[0.11em] rounded-[0.14em] border-[0.075em] border-brand-orange">
                    <span className="h-[0.1em] w-[0.1em] rounded-full bg-brand-orange" />
                    <span className="h-[0.1em] w-[0.1em] rounded-full bg-brand-orange" />
                  </span>
                </span>
                <span>BOTS</span>
              </span>
            </h1>

            <p className="m-0 text-[clamp(19px,2vw,25px)] font-medium leading-[1.35] text-white text-pretty">
              If AI can&apos;t find, understand or trust your brand, you may be invisible to your
              next customer.
            </p>
            <p className={bodyCopy}>
              Customers are no longer just searching—they&apos;re asking AI what to buy, where to go,
              who to trust and which brands matter.
            </p>
            <p className={bodyCopy}>
              <strong className="font-semibold text-brand-orange">PR for Robots</strong> is our
              webinar series exploring how publicity, strengthened by Search Engine Optimization
              (SEO), Answer Engine Optimization (AEO) and amplified by paid media, helps brands
              become visible, credible and consistently recommendable.
            </p>
          </div>

          <div className="relative flex flex-col gap-3">
            <div
              className="pointer-events-none absolute -inset-x-[4%] -top-[6%] bottom-[30%]"
              style={{
                background:
                  "radial-gradient(60% 60% at 55% 40%,rgba(242,104,28,.22),rgba(0,0,0,0) 70%)",
              }}
            />
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-card border border-hairline">
              <ImageSlot description="HERO ILLUSTRATION — humanoid robot, three-quarter from behind, orange/black duotone, facing a wall of dashboards" />
            </div>
            <HeroDashboard />
          </div>
        </section>

        {/* ------------------------------------------------------ Register */}
        <section
          id="register"
          className={`${sectionCard} grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-[clamp(28px,4vw,56px)]`}
        >
          <div className="flex flex-col gap-[18px]">
            <h2 className="m-0 text-[clamp(28px,3.2vw,40px)] font-bold leading-[1.1] tracking-[-0.02em] text-brand-orange text-pretty">
              Register Today For Our Next Live Webinar!
            </h2>
            <p className="m-0 text-[clamp(16px,1.5vw,19px)] font-semibold leading-[1.45] text-white text-pretty">
              <span className="text-brand-teal">PR for Robots</span>{" "}
              <span className="text-[#4a4a4a]">|</span> How Publicity Fuels Patient AI searches for
              Healthcare
            </p>

            <div className="flex w-fit max-w-full items-center gap-3 rounded-card border border-hairline bg-card-2 px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
                <rect x="1.5" y="3.5" width="15" height="13" rx="1.5" stroke="#F2681C" strokeWidth="1.4" />
                <path d="M1.5 7.5h15M5.5 1.5v3M12.5 1.5v3" stroke="#F2681C" strokeWidth="1.4" />
              </svg>
              <span className="font-mono text-[13.5px] tracking-[0.04em] text-white">
                September 30, 2026
              </span>
              <span className="text-brand-orange">|</span>
              <span className="font-mono text-[13.5px] tracking-[0.04em] text-brand-orange">
                3:00 PM GST
              </span>
            </div>

            <p className={bodyCopy}>
              Patients are increasingly turning to AI before choosing doctors, hospitals, clinics,
              physicians and healthcare providers as well as to diagnose symptoms and learn more
              about treatments.
            </p>
            <p className={bodyCopy}>
              In our latest{" "}
              <a href="#register" className="text-brand-teal hover:text-[#7ceccb]">
                PR for Robots
              </a>{" "}
              session, we will discuss how publicity, authority, SEO, AEO and third-party
              credibility influence AI recommendations, and how healthcare organizations can become
              more visible, trusted and recommended when patients ask AI who to trust.
            </p>
          </div>

          <RegisterForm />
        </section>

        {/* ---------------------------------------------------- More About */}
        <section className={`${sectionCard} flex flex-col gap-[clamp(20px,2.4vw,32px)]`}>
          <h2 className={sectionHeading}>More About PR for Robots</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(28px,4vw,56px)]">
            <div className="flex flex-col gap-4">
              <p className={bodyCopy}>
                AI is transforming how customers discover and evaluate brands. While websites and
                SEO still matter, AI increasingly relies on trusted third-party sources, media
                coverage, authoritative content and consistent brand signals when generating
                recommendations.
              </p>
              <p className="m-0 text-base leading-[1.75] text-white text-pretty">
                Brands that fail to build these signals risk becoming invisible.
              </p>
              <p className={bodyCopy}>
                <a href="#register" className="text-brand-teal hover:text-[#7ceccb]">
                  PR for Robots
                </a>{" "}
                cuts through the hype with practical, real-world insights and integrated strategies
                that marketers, communicators and business leaders can put to work immediately.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <p className={bodyCopy}>
                Learn why a fully integrated approach to PR, search, content and marketing is
                essential as AI rewards authority, consistency and third-party validation across
                every channel.
              </p>
              <p className={bodyCopy}>
                From media placements to mentions, backlinks to brand sentiment, we help you build
                the digital footprint AI relies on to surface and recommend you.
              </p>
              <p className={bodyCopy}>
                Whether you&apos;re in healthcare, real estate, travel, or any competitive industry,
                PR for Robots helps your brand show up where AI—and your future customers—are
                looking.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Previous webinars */}
        <section className={`${sectionCard} flex flex-col gap-[clamp(20px,2.4vw,32px)]`}>
          <h2 className={sectionHeading}>Watch Our Previous Webinars</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(20px,2.4vw,28px)]">
            {videos.map((video) => (
              <div key={video.id} className="flex flex-col gap-3.5">
                <div className="relative aspect-video w-full overflow-hidden rounded-card border border-hairline">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : (
                    <ImageSlot description={thumbnailBriefs[video.id] ?? "THUMBNAIL 1280×720"} />
                  )}
                  <PlayButton />
                </div>
                <h3 className="m-0 text-[17px] font-bold leading-[1.35] text-white text-pretty">
                  {video.title}
                </h3>
                <p className="m-0 text-[14.5px] leading-[1.65] text-body text-pretty">
                  {video.description}
                </p>
                <a
                  href={video.url || "#"}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-teal hover:text-[#7ceccb]"
                >
                  Watch Now <span>&#8594;</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- Your hosts */}
        <section className={`${sectionCard} flex flex-col gap-[clamp(20px,2.4vw,32px)]`}>
          <h2 className={sectionHeading}>Meet Your Hosts</h2>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[clamp(28px,4vw,56px)]">
            <div className="flex items-start gap-[22px]">
              <div className="host-portrait h-[132px] w-[132px] flex-none">
                <Image
                  src="/images/john-rose.jpeg"
                  alt="John Rose"
                  fill
                  sizes="132px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="text-[21px] font-bold tracking-[-0.01em] text-brand-orange">
                  John Rose
                </div>
                <p className="m-0 text-[15px] leading-[1.7] text-body text-pretty">
                  John Rose, Chairman of Rose Creative Marketing, a global marketing and PR leader
                  with a 40+ year career spanning the USA, LATAM, Europe, CIS, and the Middle East
                  representing some of the world&apos;s most successful brands.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-[22px]">
              <div className="host-portrait h-[132px] w-[132px] flex-none">
                <Image
                  src="/images/samson-ogbu.png"
                  alt="Samson Ogbu"
                  fill
                  sizes="132px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="text-[21px] font-bold tracking-[-0.01em] text-brand-orange">
                  Samson Ogbu
                </div>
                <p className="m-0 text-[15px] leading-[1.7] text-body text-pretty">
                  Samson Ogbu, Chief Technology Officer of Fitch Technologies, an MBA- and
                  PMP-certified technologist building AI-powered solutions that help brands convert
                  traffic into growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Closing CTA */}
        <section
          className={`${sectionCard} grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-center gap-[clamp(28px,4vw,56px)]`}
        >
          <div className="flex flex-col gap-4">
            <h2 className="m-0 text-[clamp(26px,3vw,36px)] font-semibold leading-[1.15] tracking-[-0.015em] text-brand-teal text-pretty">
              Ready for the Next Conversation?
            </h2>
            <p className="m-0 max-w-[56ch] text-base leading-[1.75] text-body text-pretty">
              Let&apos;s discuss how AI is changing the way customers discover, evaluate and choose
              brands—and how a fully integrated communications strategy can help ensure yours is one
              of the brands it recommends.
            </p>
          </div>
          <div className="flex flex-col gap-3.5 justify-self-stretch">
            <a
              href="#register"
              className="flex items-center justify-center gap-3 rounded-card bg-brand-orange px-6 py-[18px] text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ff7a2e]"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
                <rect x="1.5" y="3.5" width="15" height="13" rx="1.5" stroke="#fff" strokeWidth="1.4" />
                <path d="M1.5 7.5h15M5.5 1.5v3M12.5 1.5v3" stroke="#fff" strokeWidth="1.4" />
              </svg>
              Book a Consultation
            </a>
            <a
              href="#register"
              className="flex items-center justify-center gap-3 rounded-card border border-brand-teal bg-transparent px-6 py-[17px] text-center text-sm font-bold uppercase tracking-[0.12em] text-brand-teal transition-colors hover:bg-brand-teal/10"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
                <circle cx="8" cy="8" r="5.5" stroke="#3DD9A9" strokeWidth="1.4" />
                <path d="M12 12l4 4" stroke="#3DD9A9" strokeWidth="1.4" />
              </svg>
              Request an AI Visibility Audit
            </a>
          </div>
        </section>

        {/* ------------------------------------------------------- Footer */}
        <footer className="flex flex-col items-center gap-5 pt-[clamp(40px,6vw,80px)] pb-[clamp(32px,4vw,56px)]">
          <div className="relative h-[76px] w-[min(420px,100%)]">
            <Image
              src="/images/rose-fitch-logo.png"
              alt="Rose Creative Marketing and Fitch Technologies"
              fill
              sizes="420px"
              className="object-contain"
            />
          </div>
          <div className="text-center font-mono text-[11px] uppercase tracking-[0.18em] text-[#5a5a5a]">
            Rose Creative Marketing &nbsp;&middot;&nbsp; Fitch Technologies
          </div>
        </footer>
      </div>
    </main>
  );
}
