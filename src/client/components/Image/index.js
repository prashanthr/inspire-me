import React from 'react'
import './index.css'

const Image = ({ src, className, alt }) => (
  <img
    className={className} 
    alt={alt} 
    src={src} 
  />
)

export default Image
