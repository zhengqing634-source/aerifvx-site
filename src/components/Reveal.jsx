
import React, { useEffect, useRef, useState } from 'react'

export default function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
  ...rest
}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const showImmediately = () => setInView(true)

    const reduceMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (
      reduceMotion ||
      typeof window.IntersectionObserver === 'undefined'
    ) {
      showImmediately()
      return
    }

    let observer

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            showImmediately()
            observer.disconnect()
          }
        },
        {
          threshold: 0.12,
          rootMargin: '0px 0px -8% 0px'
        }
      )

      observer.observe(el)
    } catch (error) {
      showImmediately()
    }

    return () => observer?.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${inView ? 'is-in' : ''} ${className}`}
      style={{ '--d': `${delay}s` }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
