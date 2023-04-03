import { useEffect, useState } from "react"

export const useInfiniteScrolling = (
  onReachBottom: () => void, 
  dependencies?: ReadonlyArray<unknown>
) => {
  const handleScroll = () => {
    // The scrollTop property sets or returns the number of pixels an element's content is scrolled vertically
    const scrollTop = document.documentElement.scrollTop 
    // interior height of the window in pixels
    const windowHeight = window.innerHeight
    // The scrollHeight returns the height of an element
    const scrollHeight = document.documentElement.scrollHeight
  
    if (scrollTop + windowHeight >= scrollHeight) {
      onReachBottom()
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, dependencies)
}