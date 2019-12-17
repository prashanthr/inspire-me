import React, { Component } from 'react'
import Image from './client/components/Image'
import Button from './client/components/Button'
import Footer from './client/components/Footer'
import Loader from './client/components/Loader'
import config from './client/config'
import axios from 'axios'
import './App.css'

const { apiBaseUrl, servicePort } = config
const API_BASE_URL = `${apiBaseUrl}:${servicePort}`

class App extends Component {
  constructor (props) {
    super(props)
    this.inspire = this.inspire.bind(this)
    this.updateImg = this.updateImg.bind(this)
    this.state = {
      img: null,
      loading: true
    }
  }
  updateImg (data) {
    this.setState({ 
      img: data,
      loading: false
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
      .then(res => this.updateImg(res.data.data))
      .catch(err => this.setLoading(false))
  }
  componentWillMount () {
    this.inspire()
  }
  render() {
    return (
      <div className='App'>
        <div className='App-content'>
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
              <Button
                text='Haha, next!'
                className='inspire-button' 
                onClick={this.inspire}
              />
            )
          }
        </div>
        <Footer 
          className='footer'
          text='Copyright © PR.'
        />
      </div>
    );
  }
}

export default App
