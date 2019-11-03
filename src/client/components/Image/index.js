import React from 'react'

const Image = ({ src, className, alt }) => (
  <img
    className={className} 
    alt={alt} 
    src={src} 
  />
)

export default Image
