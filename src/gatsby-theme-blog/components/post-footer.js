import React from "react"
import { Link } from "gatsby"
import { css, Styled, Flex } from "theme-ui"

import Bio from "gatsby-theme-blog/src/components/bio"

const PostFooter = ({ previous, next }) => (
  <footer
    css={css({
      mt: 4,
      pt: 3,
    })}
  >
    <fieldset style={{ padding: 15 }}>
      <legend style={{ padding: 4 }}>Subscribe to my blog</legend>
      <form
        action="https://buttondown.email/api/emails/embed-subscribe/ankeetmaini"
        method="post"
        target="popupwindow"
        onsubmit="window.open('https://buttondown.email/ankeetmaini', 'popupwindow')"
        className="embeddable-buttondown-form"
      >
        <input
          type="email"
          name="email"
          id="bd-email"
          placeholder="your.awesome@email.com"
          className="textbox"
        ></input>
        <input type="hidden" value="1" name="embed"></input>
        <input className="button" type="submit" value="Subscribe"></input>
      </form>
    </fieldset>

    <br />
    <br />
    <Styled.hr />
    <Bio />
    {(previous || next) && (
      <Flex
        as="ul"
        css={css({
          flexWrap: `wrap`,
          justifyContent: `space-between`,
          listStyle: `none`,
          padding: 0,
        })}
      >
        <li>
          {previous && (
            <Styled.a as={Link} to={previous.slug} rel="prev">
              ← {previous.title}
            </Styled.a>
          )}
        </li>
        <li>
          {next && (
            <Styled.a as={Link} to={next.slug} rel="next">
              {next.title} →
            </Styled.a>
          )}
        </li>
      </Flex>
    )}
  </footer>
)

export default PostFooter
