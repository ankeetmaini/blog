import React from 'react'

import CenterLinline from './CenterInline'

export default function Giphy({ children, width = 1000 }) {
  return (
    <CenterLinline>
      <img style={{ width }} src={children}></img>
    </CenterLinline>
  )
}
