"use client";

import { useEffect } from "react";
import { initBackgroundAudio } from "@/lib/audioController";

export default function BackgroundAudio() {
  useEffect(() => initBackgroundAudio(), []);
  return null;
}
