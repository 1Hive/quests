import React from 'react'
import { GU, textStyle } from '@1hive/1hive-ui'

function Header({ title }) {
  return (
    <div
      css={`
        margin-bottom: ${4 * GU}px;
        text-align: center;
      `}
    >
      <h1
        css={`
          ${textStyle('title2')}
        `}
      >
        {title}
      </h1>
    </div>
  )
}

export default Header
