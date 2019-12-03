// what a way to make non-reusable component :/

import React, { useState, createRef, useEffect, useRef } from 'react'

export default function Reveal({ url, parts, width }) {
  const [steps, setSteps] = useState(0)
  const [imageBCR, setImageBCR] = useState({})
  const imgRef = createRef()

  const translate = steps / parts

  const onClick = () => {
    if (steps >= parts) return
    setSteps(r => r + 1)
  }

  const onLoad = () => {
    setImageBCR(imgRef.current.getBoundingClientRect())
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClick}
    >
      <img
        ref={imgRef}
        onLoad={onLoad}
        style={{ width: width || null }}
        src={url}
      ></img>
      <div
        style={{
          position: 'absolute',
          top: imageBCR.top,
          bottom: imageBCR.bottom,
          left: imageBCR.left,
          right: imageBCR.right,
          height: imageBCR.height,
          width: imageBCR.width,
          background: 'green',
          transformOrigin: '100% 0%',
          transform: `scaleX(${1 - translate})`,
          transition: 'transform 1.2s ease-out',
        }}
      ></div>
    </div>
  )
}
