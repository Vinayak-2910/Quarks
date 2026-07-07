/* eslint-disable react-hooks/set-state-in-effect */
"use client";

/** Fixed glass button to mute/unmute the ambient track (mobile + desktop). */
import { useEffect, useState } from "react";
import { isSoundEnabled, toggleSound, subscribeSound } from "@/lib/audioController";

export default function SoundToggle() {
  const [on, setOn] = useState(true);

  useEffect(() => {
    setOn(isSoundEnabled());
    return subscribeSound(setOn);
  }, []);

  return (
    <button
      type="button"
      data-cursor="link"
      onClick={() => toggleSound()}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      title={on ? "Turn sound off" : "Turn sound on"}
      className="glass fixed bottom-4 left-4 grid h-10 w-10 place-items-center rounded-full text-dust transition-colors hover:text-starlight md:bottom-5 md:left-5 md:h-11 md:w-11"
      style={{ zIndex: "var(--z-nav)" }}
    >
      {on ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <path d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M11 5 6 9H2v6h4l5 4V5z" />
          <line x1="22" y1="9" x2="16" y2="15" />
          <line x1="16" y1="9" x2="22" y2="15" />
        </svg>
      )}
    </button>
  );
}
