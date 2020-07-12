import React from "react"
import { Styled } from "theme-ui"

/**
 * Change the content to add your own bio
 */

export default function Bio() {
  return (
    <>
      Hi! I'm{" "}
      <Styled.a href="https://twitter.com/ankeetmaini">Ankeet Maini</Styled.a>
      {` `}
      <br />
      This is my blog and it's fun just like me 😎
    </>
  )
}
