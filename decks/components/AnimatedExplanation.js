import React from 'react'
import Styled, { keyframes, css } from 'styled-components'

const translate = keyframes`
  from {
    transform: translateX(-20px) translateZ(0);
  }

  to {
    transform: translateX(880px) translateZ(0);
  }
`
const AnimatedValue = Styled.div`
  height: 50px;
  width: 200px;
  background: hotpink;
  margin: 10px;
  font-size: 20px;
  text-align: center;
  color: black;
  animation: ${translate} 6s ease-in-out infinite;
`
const Flex = Styled.div`
  display: flex;
  align-items: center;
`
export default function AnimatedExplanation({ showOpacity, showRotation }) {
  return (
    <div
      style={{
        width: 1200,
        background: 'white',
        color: 'black',
      }}
    >
      <Flex style={{ height: 300 }}>
        <div style={{ padding: 5, background: 'lightblue', margin: 10 }}>0</div>
        <div>
          <AnimatedValue>Animated.Value</AnimatedValue>
          {showOpacity && (
            <AnimatedValue style={{ background: 'green', color: 'white' }}>
              interpolated - opacity
            </AnimatedValue>
          )}
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ padding: 5, background: 'lightblue', margin: 10 }}>1</div>
      </Flex>

      {showRotation && (
        <Flex style={{ height: 300 }}>
          <div
            style={{
              padding: 5,
              fontSize: 20,
              background: 'lightblue',
              margin: 10,
            }}
          >
            0<sup>°</sup>
          </div>
          <div>
            <AnimatedValue style={{ background: 'green', color: 'white' }}>
              interpolated - rotation
            </AnimatedValue>
          </div>
          <div style={{ flex: 1 }}></div>
          <div
            style={{
              padding: 5,
              fontSize: 20,
              background: 'lightblue',
              margin: 10,
            }}
          >
            360<sup>°</sup>
          </div>
        </Flex>
      )}

      <Flex />
    </div>
  )
}
