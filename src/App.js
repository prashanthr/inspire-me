import React, { Component } from 'react'
import Image from './client/components/Image'
import Button from './client/components/Button'
import Footer from './client/components/Footer'
import Loader from './client/components/Loader'
import config from './client/config'
import axios from 'axios'
import './App.css'

const API_BASE_URL = `${config.apiBaseUrl}`

class App extends Component {
  constructor (props) {
    super(props)
    this.inspire = this.inspire.bind(this)
    this.updateContext = this.updateContext.bind(this)
    this.showSourceModal = this.showSourceModal.bind(this)
    this.state = {
      source: null,
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
    this.inspire()
  }
  render() {
    return (
      <div className='App'>
        <div className='App-content'>
          <h3>Kinda Comical</h3>
          {this.state.img && 
            <Image
              className='inspire-strip' 
              alt='inspire-strip' 
              src={this.state.img}
            />
          }
          <br />
          {this.state.loading 
            ? <Loader className='spinner' />
            : (
              <div>
                <Button
                  text='Haha, next!'
                  className='inspire-button' 
                  onClick={this.inspire}
                />
                <br />
                <Button
                  text={'View Source'}
                  className='info-button' 
                  onClick={this.showSourceModal}
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
