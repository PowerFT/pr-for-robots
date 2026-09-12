import Image from "next/image";

import { RegisterForm } from "@/components/register-form";
import { SiteNav } from "@/components/site-nav";
import { Wordmark } from "@/components/wordmark";
import { videos } from "@/data/videos";

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

/**
 * Centred content column: 1200px until the viewport clears 1440px, then 1440px.
 * 24px side padding on mobile, 48px from 1024px up. Shared with the nav so both
 * gutters line up.
 */
const contentWidth = "mx-auto w-full max-w-[1200px] px-6 lg:px-12 3xl:max-w-[1440px]";

/** One full-width section card: #0C0C0C, 1px hairline, 8px radius. */
const sectionCard =
  "scroll-mt-16 bg-card border border-hairline rounded-card p-6 md:p-10 xl:p-14";
const sectionHeading =
  "m-0 text-[26px] md:text-[32px] font-semibold tracking-[-0.01em] text-brand-teal";
const bodyCopy = "m-0 text-base leading-[1.75] text-body text-pretty";
/** Body copy inside a widening two-column section — capped for line length. */
const columnCopy = `${bodyCopy} lg:max-w-[70ch]`;
/**
 * 1px hairline before every column but the first, centred in a 48px gap-12.
 * Positioned outside the column box, so it takes no width from the content.
 */
const gapDivider =
  "md:[&+&]:before:absolute md:[&+&]:before:inset-y-0 md:[&+&]:before:-left-[24.5px] md:[&+&]:before:w-px md:[&+&]:before:bg-hairline";

const heroAlt =
  "A humanoid robot seen from behind, facing a wall of dashboards reporting AI search insights, brand mentions and AI visibility scores";

export default function Home() {
  // Server-rendered, so no client JS: the page is prerendered, which fixes the
  // year at build time and every deploy picks up the current one.
  const year = new Date().getFullYear();

  return (
    <>
      <SiteNav />

      <main className={`${contentWidth} flex flex-col gap-6 pb-6`}>
        {/* ---------------------------------------------------------- Hero */}
        <section className="grid items-center gap-10 py-10 md:grid-cols-[45fr_55fr] md:py-14">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-body">
              <span>John Rose</span>
              <span className="text-brand-orange">|</span>
              <span>Samson Ogbu</span>
            </div>

            <h1 className="m-0">
              <Wordmark size="hero" />
            </h1>

            <p className="m-0 text-[19px] font-medium leading-[1.35] text-white text-pretty md:text-[23px]">
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

          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-[4%] -top-[6%] bottom-[10%]"
              style={{
                background:
                  "radial-gradient(60% 60% at 55% 40%,rgba(242,104,28,.22),rgba(0,0,0,0) 70%)",
              }}
            />
            <div className="relative overflow-hidden rounded-card border border-hairline">
              <Image
                src="/images/hero.jpg"
                alt={heroAlt}
                width={1084}
                height={992}
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                className="h-auto w-full"
              />
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Register */}
        <section id="register" className={sectionCard}>
          <div className="grid gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-hairline">
            <div className="flex flex-col gap-4 md:pr-10">
              <h2 className="m-0 text-[28px] font-bold leading-[1.1] tracking-[-0.02em] text-brand-orange text-pretty md:text-[36px]">
                Register Today For Our Next Live Webinar!
              </h2>
              <p className="m-0 text-[17px] font-semibold leading-[1.45] text-white text-pretty md:text-[19px]">
                <span className="text-brand-teal">PR for Robots</span>{" "}
                <span className="text-[#4a4a4a]">|</span> How Publicity Fuels Patient AI searches
                for Healthcare
              </p>

              <div className="flex w-fit max-w-full flex-wrap items-center gap-x-3 gap-y-1 rounded-card border border-hairline bg-card-2 px-4 py-3">
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

              <p className={columnCopy}>
                Patients are increasingly turning to AI before choosing doctors, hospitals, clinics,
                physicians and healthcare providers as well as to diagnose symptoms and learn more
                about treatments.
              </p>
              <p className={columnCopy}>
                In our latest{" "}
                <a href="#register" className="text-brand-teal hover:text-[#7ceccb]">
                  PR for Robots
                </a>{" "}
                session, we will discuss how publicity, authority, SEO, AEO and third-party
                credibility influence AI recommendations, and how healthcare organizations can
                become more visible, trusted and recommended when patients ask AI who to trust.
              </p>
            </div>

            <div className="md:pl-10">
              <RegisterForm />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------- More About */}
        <section id="about" className={`${sectionCard} flex flex-col gap-7`}>
          <h2 className={sectionHeading}>More About PR for Robots</h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-0 md:divide-x md:divide-hairline">
            <div className="flex flex-col gap-4 md:pr-10">
              <p className={columnCopy}>
                AI is transforming how customers discover and evaluate brands. While websites and
                SEO still matter, AI increasingly relies on trusted third-party sources, media
                coverage, authoritative content and consistent brand signals when generating
                recommendations.
              </p>
              <p className="m-0 text-base leading-[1.75] text-white text-pretty lg:max-w-[70ch]">
                Brands that fail to build these signals risk becoming invisible.
              </p>
              <p className={columnCopy}>
                <a href="#register" className="text-brand-teal hover:text-[#7ceccb]">
                  PR for Robots
                </a>{" "}
                cuts through the hype with practical, real-world insights and integrated strategies
                that marketers, communicators and business leaders can put to work immediately.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:pl-10">
              <p className={columnCopy}>
                Learn why a fully integrated approach to PR, search, content and marketing is
                essential as AI rewards authority, consistency and third-party validation across
                every channel.
              </p>
              <p className={columnCopy}>
                From media placements to mentions, backlinks to brand sentiment, we help you build
                the digital footprint AI relies on to surface and recommend you.
              </p>
              <p className={columnCopy}>
                Whether you&apos;re in healthcare, real estate, travel, or any competitive industry,
                PR for Robots helps your brand show up where AI—and your future customers—are
                looking.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- Previous webinars */}
        <section id="webinars" className={`${sectionCard} flex flex-col gap-7`}>
          <h2 className={sectionHeading}>Watch Our Previous Webinars</h2>
          {/* The column dividers are drawn into the 48px gap rather than as
              borders: a border sits inside the column box, so divide-x left the
              bordered columns 1px narrower and their thumbnails 0.57px shorter
              than the last one. With nothing inside the boxes, all three tracks,
              thumbnails and title rows are identical. */}
          <div className="grid gap-8 md:grid-cols-3 md:gap-12">
            {videos.map((video) => (
              <div key={video.id} className={`relative flex flex-col gap-3.5 ${gapDivider}`}>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Watch: ${video.title}`}
                  className="group relative block aspect-video w-full overflow-hidden rounded-card border border-hairline"
                >
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </a>
                <h3 className="m-0 text-[17px] font-bold leading-[1.35] text-white text-pretty">
                  {video.title}
                </h3>
                <p className="m-0 text-[14.5px] leading-[1.65] text-body text-pretty">
                  {video.description}
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-1 text-[13px] font-semibold uppercase tracking-[0.1em] text-brand-teal hover:text-[#7ceccb]"
                >
                  Watch Now <span>&#8594;</span>
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* ----------------------------------------------------- Your hosts */}
        <section className={`${sectionCard} flex flex-col gap-7`}>
          <h2 className={sectionHeading}>Meet Your Hosts</h2>
          <div className="grid gap-8 md:grid-cols-2 md:gap-10">
            <div className="flex items-start gap-5">
              <div className="host-portrait h-[132px] w-[132px] flex-none">
                {/* Source is slightly taller than wide; 20% takes up the small
                    vertical slack so his face sits in the middle of the circle. */}
                <Image
                  src="/images/john-rose.jpg"
                  alt="John Rose"
                  fill
                  sizes="132px"
                  className="object-cover object-[50%_20%]"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                <div className="text-[21px] font-bold tracking-[-0.01em] text-brand-orange">
                  John Rose
                </div>
                <p className="m-0 text-[15px] leading-[1.7] text-body text-pretty">
                  John Rose, Chairman of{" "}
                  <a
                    href="https://rosecreative.marketing/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline-offset-2 hover:underline"
                  >
                    Rose Creative Marketing
                  </a>
                  , a global marketing and PR leader with a 40+ year career spanning the USA, LATAM,
                  Europe, CIS, and the Middle East representing some of the world&apos;s most
                  successful brands.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="host-portrait h-[132px] w-[132px] flex-none">
                <Image
                  src="/images/samson-ogbu.jpg"
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
                  Samson Ogbu, Chief Technology Officer of{" "}
                  <a
                    href="https://fitchtechnologies.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-teal underline-offset-2 hover:underline"
                  >
                    Fitch Technologies
                  </a>
                  , an MBA- and PMP-certified technologist building AI-powered solutions that help
                  brands convert traffic into growth.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- Closing CTA */}
        <section id="contact" className={sectionCard}>
          <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col gap-4">
              <h2 className="m-0 text-[26px] font-semibold leading-[1.15] tracking-[-0.015em] text-brand-teal text-pretty md:text-[34px]">
                Ready for the Next Conversation?
              </h2>
              <p className="m-0 max-w-[56ch] text-base leading-[1.75] text-body text-pretty">
                Let&apos;s discuss how AI is changing the way customers discover, evaluate and
                choose brands—and how a fully integrated communications strategy can help ensure
                yours is one of the brands it recommends.
              </p>
            </div>
            <div className="flex flex-col gap-3.5">
              <a
                href="#register"
                className="flex w-full items-center justify-center gap-3 rounded-card bg-brand-orange px-6 py-[18px] text-sm font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#ff7a2e]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
                  <rect x="1.5" y="3.5" width="15" height="13" rx="1.5" stroke="#fff" strokeWidth="1.4" />
                  <path d="M1.5 7.5h15M5.5 1.5v3M12.5 1.5v3" stroke="#fff" strokeWidth="1.4" />
                </svg>
                Book a Consultation
              </a>
              <a
                href="#register"
                className="flex w-full items-center justify-center gap-3 rounded-card border border-brand-teal bg-transparent px-6 py-[17px] text-center text-sm font-bold uppercase tracking-[0.12em] text-brand-teal transition-colors hover:bg-brand-teal/10"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-none" aria-hidden>
                  <circle cx="8" cy="8" r="5.5" stroke="#3DD9A9" strokeWidth="1.4" />
                  <path d="M12 12l4 4" stroke="#3DD9A9" strokeWidth="1.4" />
                </svg>
                Request an AI Visibility Audit
              </a>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- Footer */}
        <footer className="flex flex-col items-center gap-4 py-14">
          <div className="relative h-[76px] w-[min(420px,100%)]">
            <Image
              src="/images/rose-fitch-logo.png"
              alt="Rose Creative Marketing and Fitch Technologies"
              fill
              sizes="420px"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="m-0 text-[12px] text-[#888]">
              &copy; {year} Rose Creative Marketing and Fitch Technologies. All rights reserved.
            </p>
            <a
              href="https://fitchtechnologies.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-[#666] transition-colors hover:text-brand-teal"
            >
              Web Design by Fitch Technologies
            </a>
          </div>
        </footer>
      </main>
    </>
  );
}
