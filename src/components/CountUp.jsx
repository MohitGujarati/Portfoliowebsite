import { useEffect, useRef, useState } from 'react'

// Animates numeric stat values (handles "2+", "30%", "3.8") when scrolled into view.
export default function CountUp({ value, duration = 1400 }) {
  const match = String(value).match(/^([\d.]+)(.*)$/)
  const target = match ? parseFloat(match[1]) : null
  const suffix = match ? match[2] : ''
  const decimals = match && match[1].includes('.') ? match[1].split('.')[1].length : 0

  const ref = useRef(null)
  const [display, setDisplay] = useState(target === null ? value : 0)

  useEffect(() => {
    if (target === null) return
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(target)
      return
    }

    let raf
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const start = performance.now()
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setDisplay(target * eased)
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [target, duration])

  if (target === null) return <span>{value}</span>
  return (
    <span ref={ref}>
      {Number(display).toFixed(decimals)}
      {suffix}
    </span>
  )
}
