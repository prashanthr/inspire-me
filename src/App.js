import React, { Component } from 'react'
import Image from './client/components/Image'
import Button from './client/components/Button'
import Footer from './client/components/Footer'
import Loader from './client/components/Loader'
import FlipImage from './client/components/FlipImageCard'
import config from './client/config'
import axios from 'axios'
import { loadAnalytics } from './client/utils/analytics'
import './App.css'

const API_BASE_URL = `${config.apiBaseUrl}`

class App extends Component {
  constructor (props) {
    super(props)
    this.inspire = this.inspire.bind(this)
    this.updateContext = this.updateContext.bind(this)
    this.showSourceModal = this.showSourceModal.bind(this)
    this.state = {
      flippable: false,
      source: { name: null, url: null },
      img: null,
      loading: true
    }
  }
  updateContext (context) {
    this.setState({ 
      img: context.data,
      source: context.source,
      loading: false
    })
  }

  setLoading (value) {
    this.setState({
      loading: value
    })
  }

  showSourceModal () {
    alert(`
      Source Info:
      ----------------------------------------------------------------
      Source: ${this.state.source.name}
      Url: ${this.state.source.url}
    `)
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
    console.log('this.state', this.state)
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
        <div className='App-content'>
          <h3>Kinda Comical</h3>
          {this.state.img && (
            this.state.flippable 
            ? <FlipImageOnly />
            : <ImageOnly />
          )}
          <br />
          {this.state.loading 
            ? <Loader className='spinner' />
            : (
              <div>
                <Button
                  text={'View Image Source'}
                  className='info-button' 
                  onClick={this.showSourceModal}
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
