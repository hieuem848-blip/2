"use client";

import { useEffect } from "react";

export default function ScrollRevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;

    const sections = Array.from(
      root.querySelectorAll("section, [data-scroll-reveal]")
    ) as HTMLElement[];

    sections.forEach((el) => {
      if (!el.classList.contains("scroll-reveal")) {
        el.classList.add("scroll-reveal");
      }
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add("scroll-reveal--visible");
            obs.unobserve(target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    sections.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
