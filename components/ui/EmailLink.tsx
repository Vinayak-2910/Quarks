import { useState } from "react";

export function EmailLink({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(email);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000); // After 2 seconds it goes back to "Click to copy"
  } catch (err) {
    console.error(err);
  }
};

  return (
    <span className="relative inline-block group">
      <button
        onClick={handleCopy}
        data-cursor="link"
        className="text-cherenkov-300 hover:text-whitehot text-lg md:text-xl transition-colors"
      >
        {email}
      </button>

      <span className="absolute left-1/2 -translate-x-1/2 -top-8 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
  {copied ? "Copied" : "Click to copy"}
</span>
    </span>
  );
}