import React, { Component } from 'react'
import Image from './client/components/Image'
import Button from './client/components/Button'
import Footer from './client/components/Footer'
import Loader from './client/components/Loader'
import FlipImage from './client/components/FlipImageCard'
import Modal from './client/components/Modal'
import Emoji from './client/components/Emoji'
import config from './client/config'
import axios from 'axios'
import { loadAnalytics } from './client/utils/analytics'
import './App.css'

const API_BASE_URL = `${config.apiBaseUrl}`

const SourceInfoModal = ({ isOpen, onClose, name, url }) => (
  <Modal 
    isOpen={isOpen}
    onClose={onClose}
    content={(
      <div>
        <h3>Comic Source Info</h3>
        <hr />
        <span>Source: {name}</span>
        <br />
        <p>Url: 
          <a target='_blank' href={url} rel="noopener noreferrer">
            {url}
          </a>
        </p>
      </div>
    )}
  />
)

const FaqModal = ({ isOpen, onClose }) => (
  <Modal 
    isOpen={isOpen}
    onClose={onClose}
    content={(
      <div>
        <h3>Welcome to {API_BASE_URL}!</h3>
        <hr />
        <p>
          This web app is a fun way to browse random popular comic strips. It's meant to make you laugh and bring you joy and happiness. Thanks for visiting!
        </p>
        <p>
          NOTE: All comic strips belong to their respective creators.
          This site is a random browser/aggregator and I do not own any of the comics.
          Click on the View Image Source to learn more about the comic.
        </p>
      </div>
    )}
  />
)

class App extends Component {
  constructor (props) {
    super(props)
    this.inspire = this.inspire.bind(this)
    this.updateContext = this.updateContext.bind(this)
    this.toggleSourceInfo = this.toggleSourceInfo.bind(this)
    this.toggleFaq = this.toggleFaq.bind(this)
    this.state = {
      flippable: false,
      source: { name: null, url: null },
      img: null,
      loading: true,
      isFaqOpen: false,
      isSourceOpen: false
    }
  }
  updateContext (context) {
    this.setState({ 
      img: context.data,
      source: context.source,
      loading: false
    })
  }

  toggleFaq () {
    this.setState({
      isFaqOpen: !this.state.isFaqOpen
    })
  }

  toggleSourceInfo() {
    this.setState({
      isSourceOpen: !this.state.isSourceOpen
    })
  }

  setLoading (value) {
    this.setState({
      loading: value
    })
  }

  inspire () {
    this.setLoading(true)
    axios
      .get(`${API_BASE_URL}/api/inspire`)
      .then(res => this.updateContext(res.data))
      .catch(err => this.setLoading(false))
  }
  componentWillMount () {
    loadAnalytics(config.analytics.google.propertyId)
    this.inspire()
  }
  render() {
    const ImageOnly = () =>
      <Image
        className='comical-strip' 
        alt='comical-strip' 
        src={this.state.img}
      />
    const FlipImageOnly = () => (
      <FlipImage
        frontComponent={<ImageOnly />}
        rearComponent={(
          <div>
            Source: {this.state.source.name} / 
            Url: {this.state.source.url}
          </div>
        )}
      />
    )
    return (
      <div className='App'>
        <div className='menu-lt'>
          <h2>Kinda Comical</h2>
        </div>
        <div className='menu-rt'>
          <div className='menu-rt-content'>
            <Button
              text={<div>Info <Emoji emoji='ℹ' label='info' /></div>}
              className='info-button menu-rt-link' 
              onClick={this.toggleFaq}
            />
          </div>
        </div>
        <div className='App-content'>
          <div className='comical-site-modals'>
            {<FaqModal 
              isOpen={this.state.isFaqOpen}
              onClose={this.toggleFaq}
            />}
            {<SourceInfoModal
              isOpen={this.state.isSourceOpen}
              onClose={this.toggleSourceInfo}
              name={this.state.source.name}
              url={this.state.source.url}
              />}
          </div>
          <div className='comic-strip-wrap'>
            {this.state.img && (
              this.state.flippable 
              ? <FlipImageOnly />
              : <ImageOnly />
            )}
          </div>
          <br />
          {this.state.loading 
            ? <Loader className='spinner' />
            : (
              <div>
                <Button
                  text={'View Comic Source'}
                  className='info-button' 
                  onClick={this.toggleSourceInfo}
                />
                <br /><br />
                <Button
                  text='Haha, next!'
                  className='inspire-button' 
                  onClick={this.inspire}
                />
              </div>
            )
          }
        </div>
        <Footer 
          className='footer'
          text='Copyright © PR. Made with 💛. '
        />
      </div>
    );
  }
}

export default App
