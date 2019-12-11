import React, { useState } from 'react'
import Styled from 'styled-components'

const AbsoluteCenter = Styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`

const centerStyle = {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translateX(-50%) translateY(-50%)',
}

const Circle = Styled.div`
  width: ${props => props.width || 300}px;
  height: ${props => props.height || 300}px;
  background: ${props => props.background || 'grey'};
  border-radius: 50%;
  position: absolute;
  left: 0;
`

const Semi = Styled.div`
  height: ${props => props.height || 300}px;
  width: ${props => props.height / 2 || 150}px;
  background: ${props => props.background || 'grey'};
  border-bottom-left-radius: ${props => (props.height || 300) * 2}px;
  border-top-left-radius: ${props => (props.height || 300) * 2}px;
  position: absolute;
  left: 0;
`

export default function CircularProgress() {
  const [showFirst, setShowFirst] = useState(true)
  const [showMiddle, setShowMiddle] = useState(false)
  const [showSemi1, setShowSemi1] = useState(false)
  const [showSemi2, setShowSemi2] = useState(false)
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 900,
        minWidth: 800,
        fontSize: 16,
        fontFamily: 'mono',
      }}
    >
      <div>
        <label>
          <input
            type="checkbox"
            checked={showFirst}
            onChange={e => setShowFirst(e.target.checked)}
          />
          outer circle
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showMiddle}
            onChange={e => setShowMiddle(e.target.checked)}
          />
          middle circle
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showSemi1}
            onChange={e => setShowSemi1(e.target.checked)}
          />
          semi 1
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={showSemi2}
            onChange={e => setShowSemi2(e.target.checked)}
          />
          semi 2
        </label>
      </div>
      <div style={{ position: 'relative' }}>
        <AbsoluteCenter>
          {showFirst && (
            <Circle>
              {showSemi1 && <Semi background="red" />}
              {showSemi2 && <Semi background="green" />}

              {showMiddle && (
                <Circle
                  style={centerStyle}
                  width={200}
                  height={200}
                  background="white"
                ></Circle>
              )}
            </Circle>
          )}
        </AbsoluteCenter>
      </div>
    </div>
  )
}
