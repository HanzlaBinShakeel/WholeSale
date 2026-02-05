import { useEffect, useRef, useState } from 'react'

const DEFAULT_OPTIONS = {
  root: null,
  rootMargin: '0px 0px -60px 0px',
  threshold: 0.1,
  triggerOnce: true,
}

export function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const opts = { ...DEFAULT_OPTIONS, ...options }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (opts.triggerOnce) observer.unobserve(el)
        } else if (!opts.triggerOnce) {
          setIsVisible(false)
        }
      },
      { root: opts.root, rootMargin: opts.rootMargin, threshold: opts.threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [opts.root, opts.rootMargin, opts.threshold, opts.triggerOnce])

  return [ref, isVisible]
}

export default useScrollReveal
