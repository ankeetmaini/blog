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
  padding: 10px;
  border: 1px solid #afafaf;
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
  transform-origin: right center;
  transform: rotate(${p => p.rotate || 0}deg);
`

export default function CircularProgress() {
  const [showFirst, setShowFirst] = useState(true)

  const [showMiddle, setShowMiddle] = useState(false)
  const [middleColor, setMiddleColor] = useState('#011526')

  const [showSemi1, setShowSemi1] = useState(false)
  const [semi1Color, setSemi1Color] = useState('red')
  const [rotate1, setRotate1] = useState(0)

  const [showSemi2, setShowSemi2] = useState(false)
  const [semi2Color, setSemi2Color] = useState('green')
  const [rotate2, setRotate2] = useState(0)

  const [showSemi3, setShowSemi3] = useState(false)
  const [semi3Color, setSemi3Color] = useState('grey')
  const [rotate3, setRotate3] = useState(0)
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
            <option value="#011526">dark blue</option>
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
          <Legend bg={semi1Color} /> semi 1
        </Label>
        <Label>
          <select
            value={semi1Color}
            onChange={e => setSemi1Color(e.target.value)}
          >
            <option value="red">red</option>
            <option value="green">green</option>
          </select>
        </Label>
        <Label>
          <input
            type="range"
            step={10}
            value={rotate1}
            min={0}
            max={360}
            onChange={e => setRotate1(e.target.value)}
          />
        </Label>
      </Row>
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showSemi2}
            onChange={e => setShowSemi2(e.target.checked)}
          />
          <Legend bg={semi2Color} /> semi 2
        </Label>
        <Label>
          <select
            value={semi2Color}
            onChange={e => setSemi2Color(e.target.value)}
          >
            <option value="green">green</option>
            <option value="red">red</option>
            <option value="grey">grey</option>
          </select>
        </Label>
        <Label>
          <input
            type="range"
            step={10}
            value={rotate2}
            min={0}
            max={360}
            onChange={e => setRotate2(e.target.value)}
          />
        </Label>
      </Row>
      <Row>
        <Label>
          <input
            type="checkbox"
            checked={showSemi3}
            onChange={e => setShowSemi3(e.target.checked)}
          />
          <Legend bg={semi3Color} /> semi 3
        </Label>
        <Label>
          <select
            value={semi3Color}
            onChange={e => setSemi3Color(e.target.value)}
          >
            <option value="grey">grey</option>
            <option value="teal">teal</option>
          </select>
        </Label>
        <Label>
          <input
            type="range"
            step={10}
            value={rotate3}
            min={0}
            max={360}
            onChange={e => setRotate3(e.target.value)}
          />
        </Label>
      </Row>
      <div style={{ position: 'relative', left: '-20%', top: '10%' }}>
        <AbsoluteCenter>
          {showFirst && (
            <Circle>
              {showSemi1 && <Semi rotate={rotate1} background={semi1Color} />}
              {showSemi2 && <Semi rotate={rotate2} background={semi2Color} />}
              {showSemi3 && <Semi rotate={rotate3} background={semi3Color} />}

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
