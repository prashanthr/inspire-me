import React from 'react'
import './index.css'

const FlipImageCard = ({ className, frontComponent, rearComponent }) => (
  <div class='flip-card-img'>
    <div class='flip-card-inner'>
      <div class='flip-card-front'>
        {frontComponent}
      </div>
      <div class='flip-card-rear'>
        {rearComponent}
      </div>
    </div>
  </div>
)

export default FlipImageCard
