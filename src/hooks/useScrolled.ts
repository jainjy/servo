// useScrolled.ts
import { useEffect, useState } from "react";

export function useScrolled(threshold: number = 50) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const container = document.querySelector<HTMLDivElement>(".app-pull-to-refresh");
    if (!container) return;

    const onScroll = () => {
      setScrolled(container.scrollTop > threshold);
    };

    onScroll(); // init

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
