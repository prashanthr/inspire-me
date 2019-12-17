import React from 'react'
import './index.css'

const FlipImageCard = ({ className, frontComponent, rearComponent }) => (
  <div className={`flip-card-img ${className}`}>
    <div className='flip-card-inner'>
      <div className='flip-card-front'>
        {frontComponent}
      </div>
      <div className='flip-card-rear'>
        {rearComponent}
      </div>
    </div>
  </div>
)

export default FlipImageCard
