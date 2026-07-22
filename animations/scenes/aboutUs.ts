/**
 * S5 - About us. The field between the collisions and the scale.
 *
 * Scrub-driven emergence:
 *   1. Heading resolves word-by-word out of blur (first in the sequence).
 *   2. Eyebrow, rule, and body text blur-in after the heading.
 *   3. The 4 principle cards slide up from below and unblur, staggered.
 *   4. Card glyphs scale-in after their parent card arrives.
 *
 * Everything is tied to scroll progress via `scrub: true` so nothing is
 * visible until the user scrolls the section into view.
 */
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { register, unregister } from "@/animations/core/timelineRegistry";
import { reportSceneRange } from "@/animations/core/sceneRanges";
import { setHudLabel } from "@/components/persistent/SectionHUD";
import { ABOUT_US } from "@/constants/content";
import { DURATION, EASE } from "@/constants/motion";
import type { SceneBuildArgs } from "@/hooks/useSceneTrigger";

export interface AboutUsRefs {
  section: HTMLElement | null;
  rule: HTMLDivElement | null;
  eyebrow: HTMLParagraphElement | null;
  headline: HTMLHeadingElement | null;
  body: HTMLParagraphElement | null;
  cards: (HTMLElement | null)[];
}

export function createAboutUsScene({
  refs,
  reduced,
}: SceneBuildArgs<AboutUsRefs>): () => void {
  const { section, rule, eyebrow, headline, body, cards } = refs;
  if (!section) return () => { };

  const panels = cards.filter((c): c is HTMLElement => !!c);
  const glyphs = panels
    .map((c) => c.querySelector<SVGElement>("[data-principle-symbol]"))
    .filter((g): g is SVGElement => !!g);

  const hud = () => setHudLabel(ABOUT_US.hudLabel);

  /* ── reduced-motion path ─────────────────────────────────────── */
  if (reduced) {
    const st = register(
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 40%",
        onEnter: hud,
        onEnterBack: hud,
        onRefresh: (self) => reportSceneRange("aboutUs", self),
      }),
    );
    return () => {
      unregister(st);
      st.kill();
    };
  }

  /* ── split the headline into words ───────────────────────────── */
  const split = headline ? new SplitText(headline, { type: "words" }) : null;
  const words = (split?.words as HTMLElement[] | undefined) ?? [];

  /* ── initial hidden state ────────────────────────────────────── */
  if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, x: -12, filter: "blur(10px)" });
  if (words.length) gsap.set(words, { autoAlpha: 0, y: 34, filter: "blur(14px)" });
  if (body) gsap.set(body, { autoAlpha: 0, y: 22, filter: "blur(10px)" });
  if (panels.length) gsap.set(panels, { autoAlpha: 0, y: 80, filter: "blur(12px)" });
  if (glyphs.length) gsap.set(glyphs, { autoAlpha: 0, scale: 0.82, transformOrigin: "50% 50%" });

  /* ── scrub timeline ──────────────────────────────────────────── */
  const tl = gsap.timeline();

  // ─ Phase 1: Headline appears first (words stagger out of blur)
  if (words.length)
    tl.to(
      words,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DURATION.base,
        stagger: 0.07,
        ease: EASE.emergence,
      },
      0,
    );

  // ─ Phase 2: Eyebrow + rule (starts slightly after headline begins)
  if (eyebrow)
    tl.to(
      eyebrow,
      {
        autoAlpha: 1,
        x: 0,
        filter: "blur(0px)",
        duration: DURATION.base,
        ease: EASE.emergence,
      },
      0.25,
    );
  if (rule)
    tl.to(rule, { scaleX: 1, duration: DURATION.cinematic, ease: EASE.orbital }, 0.25);

  // ─ Phase 3: Body text blurs in after headline resolves
  if (body)
    tl.to(
      body,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DURATION.base,
        ease: EASE.emergence,
      },
      0.55,
    );

  // ─ Phase 4: Cards slide up from below + unblur, staggered
  if (panels.length)
    tl.to(
      panels,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DURATION.cinematic,
        stagger: 0.15,
        ease: EASE.emergence,
      },
      0.75,
    );

  // ─ Phase 5: Glyphs scale-in on the cards
  if (glyphs.length)
    tl.to(
      glyphs,
      {
        autoAlpha: 1,
        scale: 1,
        duration: DURATION.base,
        stagger: 0.12,
        ease: EASE.elastic,
      },
      1.0,
    );

  /* ── ScrollTrigger with scrub ────────────────────────────────── */
  const st = register(
    ScrollTrigger.create({
      trigger: section,
      start: "top 90%",
      end: "bottom 3%",
      scrub: true,
      animation: tl,
      onEnter: hud,
      onEnterBack: hud,
      onRefresh: (self) => reportSceneRange("aboutUs", self),
    }),
  );

  return () => {
    unregister(st);
    st.kill();
    tl.kill();
    split?.revert();
  };
}
