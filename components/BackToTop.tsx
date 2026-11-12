"use client";

export function BackToTop({ className }: { className: string }) {
  return (
    <button
      onClick={() => (document.querySelector("[data-scroll]") ?? window).scrollTo({ top: 0, behavior: "smooth" })}
      className={className}
    >
      Back to top
    </button>
  );
}
