import React from 'react'

export default function FullScreen() {
  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={() => document.body.requestFullscreen()}>
        Fullscreen
      </button>
    </div>
  )
}
