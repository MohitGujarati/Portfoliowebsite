import { useRef, useCallback } from 'react'

// 3D tilt-on-hover via CSS custom properties. Attach the returned handlers to a card.
export default function useTilt(maxDeg = 5) {
  const ref = useRef(null)

  const onMouseMove = useCallback(
    (e) => {
      const el = ref.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      el.style.setProperty('--tilt-x', `${(-py * maxDeg).toFixed(2)}deg`)
      el.style.setProperty('--tilt-y', `${(px * maxDeg).toFixed(2)}deg`)
    },
    [maxDeg],
  )

  const onMouseLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tilt-x', '0deg')
    el.style.setProperty('--tilt-y', '0deg')
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
