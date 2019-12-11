import React, { useState } from 'react'
import Styled from 'styled-components'

const AbsoluteCenter = Styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
`

const Row = Styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px;
  border: 1px dashed rgb(232, 64, 148);
`

const Legend = Styled.div`
  width: 20px;
  display: inline-block;
  height: 20px;
  margin: 6px;
  border: 1px solid #fff;
  margin-bottom: -6px;
  background: ${p => p.bg};
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

const Label = Styled.label`
  display: block;
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
  const [middleColor, setMiddleColor] = useState('#011526')

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
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showFirst}
            onChange={e => setShowFirst(e.target.checked)}
          />
          <Legend bg="grey" /> outer circle
        </Label>
      </Row>
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showMiddle}
            onChange={e => setShowMiddle(e.target.checked)}
          />
          <Legend bg={middleColor} /> middle circle
        </Label>
        <Label>
          <select
            value={middleColor}
            onChange={e => setMiddleColor(e.target.value)}
          >
            <option value="#011526">dark blue matching with slide theme</option>
            <option value="hotpink">hotpink</option>
            <option value="white">white</option>
          </select>
        </Label>
      </Row>
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showSemi1}
            onChange={e => setShowSemi1(e.target.checked)}
          />
          <Legend bg="red" /> semi 1
        </Label>
      </Row>
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showSemi2}
            onChange={e => setShowSemi2(e.target.checked)}
          />
          <Legend bg="green" /> semi 2
        </Label>
      </Row>
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
                  background={middleColor}
                ></Circle>
              )}
            </Circle>
          )}
        </AbsoluteCenter>
      </div>
    </div>
  )
}
