import React from 'react'
import './index.css'

const Button = ({ text, onClick, className }) => (
  <button
    className={className}
    onClick={onClick}
  >
    {text}
  </button>
)

export default Button
