/**
 * S5 - About us. The field between the collisions and the scale.
 * A single emergence pass: eyebrow rule draws, the headline resolves word by
 * word out of depth, then the principle cards rise in stagger (Bible §0.1).
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
  if (!section) return () => {};

  const panels = cards.filter((c): c is HTMLElement => !!c);
  const glyphs = panels
    .map((c) => c.querySelector<SVGElement>("[data-principle-symbol]"))
    .filter((g): g is SVGElement => !!g);

  const hud = () => setHudLabel(ABOUT_US.hudLabel);

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

  const split = headline ? new SplitText(headline, { type: "words" }) : null;
  const words = (split?.words as HTMLElement[] | undefined) ?? [];

  if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });
  if (eyebrow) gsap.set(eyebrow, { autoAlpha: 0, x: -12 });
  if (words.length) gsap.set(words, { autoAlpha: 0, y: 34, filter: "blur(12px)" });
  if (body) gsap.set(body, { autoAlpha: 0, y: 22, filter: "blur(8px)" });
  if (panels.length) gsap.set(panels, { autoAlpha: 0, y: 44, filter: "blur(10px)" });
  if (glyphs.length) gsap.set(glyphs, { autoAlpha: 0, scale: 0.82, transformOrigin: "50% 50%" });

  const tl = gsap.timeline({ paused: true });

  if (eyebrow)
    tl.to(eyebrow, { autoAlpha: 1, x: 0, duration: DURATION.base, ease: EASE.emergence }, 0);
  if (rule)
    tl.to(rule, { scaleX: 1, duration: DURATION.cinematic, ease: EASE.orbital }, 0);
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
      0.12,
    );
  if (body)
    tl.to(
      body,
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: DURATION.base, ease: EASE.emergence },
      0.34,
    );
  if (panels.length)
    tl.to(
      panels,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: DURATION.base,
        stagger: 0.1,
        ease: EASE.emergence,
      },
      0.46,
    );
  if (glyphs.length)
    tl.to(
      glyphs,
      { autoAlpha: 1, scale: 1, duration: DURATION.base, stagger: 0.1, ease: EASE.elastic },
      0.56,
    );

  const st = register(
    ScrollTrigger.create({
      trigger: section,
      start: "top 70%",
      end: "bottom 40%",
      onEnter: () => {
        hud();
        tl.play();
      },
      // entering from below (or landing mid-section on load / via #about-us)
      // must resolve the copy too - otherwise it stays at its hidden state.
      onEnterBack: () => {
        hud();
        tl.play();
      },
      onRefresh: (self) => {
        reportSceneRange("aboutUs", self);
        if (self.progress > 0 && self.progress < 1) tl.progress(1).pause();
      },
    }),
  );

  return () => {
    unregister(st);
    st.kill();
    tl.kill();
    split?.revert();
  };
}
