import { useEffect } from "react";

type UseInfiniteScrolling = (
  onReachBottom: () => (() => void) | void,
  dependencies?: ReadonlyArray<unknown>
) => void;

export const useInfiniteScrolling: UseInfiniteScrolling = (
  onReachBottom,
  dependencies
) => {
  useEffect(() => {
    let cleanupFunction = () => {};

    const handleScroll = () => {
      // The scrollTop property sets or returns the number of pixels an element's content is scrolled vertically
      const scrollTop = Math.ceil(document.documentElement.scrollTop);
      // interior height of the window in pixels
      const windowHeight = window.innerHeight;
      // The scrollHeight returns the height of an element
      const scrollHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= scrollHeight) {
        const cb = onReachBottom();
        cleanupFunction = cb ? cb : () => {};
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cleanupFunction();
    };
  }, dependencies);
};
