"use client";

/**
 * S5 - About us. Sits between the collisions and the scale: the field the work
 * happens in. Reuses the Forces panel language (glass + glass-lit, line-art
 * symbols, mono index) so it reads as one system.
 */
import { useEffect, useRef } from "react";
import { useSceneTrigger } from "@/hooks/useSceneTrigger";
import { createAboutUsScene, type AboutUsRefs } from "@/animations/scenes/aboutUs";
import { attachPanelLighting } from "@/animations/interactions/panelLighting";
import { ABOUT_US } from "@/constants/content";

/** Line-art glyphs drawn on the same 100×100 grid as the Forces symbols. */
const SYMBOL_PATHS: Record<string, string[]> = {
  innovation: [
    "M50 12 a24 24 0 0 1 14 43 L64 66 L36 66 L36 55 A24 24 0 0 1 50 12 Z",
    "M40 74 L60 74",
    "M43 82 L57 82",
    "M50 12 L50 4",
    "M22 30 L15 25",
    "M78 30 L85 25",
  ],
  results: [
    "M50 50 m-38 0 a38 38 0 1 0 76 0 a38 38 0 1 0 -76 0",
    "M50 50 m-22 0 a22 22 0 1 0 44 0 a22 22 0 1 0 -44 0",
    "M50 50 m-6 0 a6 6 0 1 0 12 0 a6 6 0 1 0 -12 0",
    "M50 50 L86 22",
    "M78 14 L86 22 L80 30",
  ],
  transparency: [
    "M14 50 C 26 28, 74 28, 86 50 C 74 72, 26 72, 14 50 Z",
    "M50 50 m-14 0 a14 14 0 1 0 28 0 a14 14 0 1 0 -28 0",
    "M50 50 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0",
    "M22 22 L34 34",
    "M78 22 L66 34",
  ],
  growth: [
    "M12 84 L88 84",
    "M12 84 L12 14",
    "M22 70 L40 52 L54 62 L82 28",
    "M66 28 L82 28 L82 44",
    "M40 52 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
    "M54 62 m-4 0 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
  ],
};

export default function AboutUs() {
  const section = useRef<HTMLElement>(null);
  const rule = useRef<HTMLDivElement>(null);
  const eyebrow = useRef<HTMLParagraphElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const body = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>(
    Array(ABOUT_US.principles.length).fill(null),
  );

  useSceneTrigger<AboutUsRefs>((args) => createAboutUsScene(args), {
    get section() {
      return section.current;
    },
    get rule() {
      return rule.current;
    },
    get eyebrow() {
      return eyebrow.current;
    },
    get headline() {
      return headline.current;
    },
    get body() {
      return body.current;
    },
    get cards() {
      return cardRefs.current;
    },
  });

  useEffect(() => {
    if (!section.current) return;
    return attachPanelLighting(section.current);
  }, []);

  return (
    <section
      ref={section}
      id="about-us"
      aria-labelledby="about-us-title"
      className="relative flex min-h-screen items-center overflow-hidden px-6 py-24 lg:px-24 lg:py-32"
      style={{ zIndex: "var(--z-scene)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 18% 30%, rgba(56,219,255,0.10), transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(56,219,255,0.35), transparent)",
        }}
      />

      <div className="relative w-full">
        <div className="max-w-3xl">
          <p ref={eyebrow} className="type-mono text-cherenkov-300">
            {ABOUT_US.eyebrow}
          </p>
          <h2
            id="about-us-title"
            ref={headline}
            className="type-display mt-6 text-starlight"
            style={{ fontSize: "clamp(2.4rem, 6vw, 5.5rem)" }}
          >
            {ABOUT_US.headline}{" "}
            <span className="text-cherenkov-500">{ABOUT_US.headlineAccent}</span>
          </h2>
          <div
            ref={rule}
            aria-hidden="true"
            className="mt-8 h-px w-64 bg-cherenkov-700"
          />
          <p
            ref={body}
            className="mt-8 max-w-2xl text-base leading-relaxed text-starlight/90"
          >
            {ABOUT_US.body}
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {ABOUT_US.principles.map((p, k) => (
            <article
              key={p.id}
              ref={(el) => {
                cardRefs.current[k] = el;
              }}
              className="glass glass-lit flex h-full flex-col rounded-2xl p-6 transition-colors duration-500 hover:border-cherenkov-500/40"
            >
              <div aria-hidden="true" className="h-12 w-12 shrink-0">
                <svg
                  data-principle-symbol
                  viewBox="0 0 100 100"
                  className="h-full w-full overflow-visible"
                  fill="none"
                >
                  {SYMBOL_PATHS[p.symbol].map((d, i) => (
                    <path
                      key={i}
                      d={d}
                      stroke={i === 0 ? "#9ff1ff" : "#38dbff"}
                      strokeWidth={i === 0 ? 3.2 : 2.4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        filter: "drop-shadow(0 0 6px rgba(56,219,255,0.55))",
                      }}
                    />
                  ))}
                </svg>
              </div>

              <p className="type-mono mt-6 text-dust">{p.index}</p>
              <h3 className="type-display mt-2 text-2xl text-starlight lg:text-3xl">
                {p.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-starlight/70">
                {p.line}
              </p>
              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="type-mono rounded-full border border-white/10 px-3 py-1 text-dust"
                    style={{ fontSize: "0.6rem" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
