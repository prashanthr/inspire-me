import React from 'react'
import { Modal } from '@universal-apps/swan-react'
import './index.css'

const ModalComponent = ({ isOpen, onClose, content }) => (
  <Modal 
    isOpen={isOpen}
    onClose={onClose}
    className='comical-site-modal'
    contentClassName='comical-site-modal-content'
    content={content}
  />
)

export default ModalComponent
