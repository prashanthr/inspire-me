import React from 'react'
import Emoji from '../Emoji'
import config from '../../config'
import './index.css'

const Footer = ({ text, className }) => (
  <footer
    className={className}
  >
    {text}
    <a href={config.coffeeUrl} target='_blank' rel='noopener noreferrer'>
      <span>
        Buy me a coffee&nbsp;
        <Emoji emoji={'☕'} label='coffee' />
      </span>
    </a>
  </footer>
)

export default Footer
