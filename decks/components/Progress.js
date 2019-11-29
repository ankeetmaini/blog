import React from 'react'
import { useDeck } from 'mdx-deck'

const main = {
  width: '100%',
  background: '#000',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
}

const progress = {
  background: '#42ff71',
  width: '100%',
  willChange: 'transform',
  transformOrigin: '0% 0%',
  transform: 'scaleX(0)',
  transition: 'transform 1.2s cubic-bezier(0.445, 0.05, 0.55, 0.95)',
}

export default function Progress({ children }) {
  const { index, length } = useDeck()
  const translate = (index + 1) / length
  const height = 8
  return (
    <div
      style={{
        position: 'relative',
      }}
    >
      {children}
      <div style={{ position: 'fixed', left: '5%', right: '5%', bottom: 10 }}>
        <div style={{ height, ...main }}>
          <div
            style={{ ...progress, height, transform: `scaleX(${translate})` }}
          />
        </div>
      </div>
    </div>
  )
}
