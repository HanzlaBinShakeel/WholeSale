import React from 'react'
import { useScrollReveal } from '../hooks/useScrollReveal'

function ScrollReveal({ children, variant = 'fadeUp', delay = 0, className = '', ...props }) {
  const [ref, isVisible] = useScrollReveal(props)

  const classes = [
    'scroll-reveal',
    `scroll-reveal-${variant}`,
    isVisible && 'scroll-reveal-visible',
    className
  ].filter(Boolean).join(' ')

  return (
    <div ref={ref} className={classes} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}

export default ScrollReveal
