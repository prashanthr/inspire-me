import React from 'react'
import { Button, Modal } from '@universal-apps/swan-react'
import './index.css'

const closeComponent = ({ onClose }) => (
  <Button
    onClick={onClose}
    value={'X'}
    withBorder
  />
)

const ModalComponent = ({ isOpen, onClose, content }) => (
  <Modal 
    isOpen={isOpen}
    onClose={onClose}
    closeComponent={closeComponent}
    className='comical-site-modal'
    contentClassName='comical-site-modal-content'
    content={content}
  />
)

export default ModalComponent
