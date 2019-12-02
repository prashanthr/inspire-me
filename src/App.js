import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

const API_BASE_URL = process.env.NODE_ENV.toLowerCase === 'production' ? 'comical.site' : `http://localhost:${process.env.SERVICE_PORT || 9000}`
console.log('API_BASE_URL', API_BASE_URL, 'SERVICE_PORT', process.env.SERVICE_PORT)
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
      <div className="App">
        <div className="App-content">
          {this.state.img && 
            <img 
              className='inspire-strip' 
              alt='inspire-strip' 
              src={this.state.img} 
            />
          }
          <br />
          {this.state.loading 
            ? (<div className='spinner' />)
            : (
              <button
                className='inspire-button' 
                onClick={this.inspire}
              >
                Haha, next!
              </button>
            )
          }
        </div>
        <footer className='footer'>
          Copyright © <a href='https://prashanthr.me' target='_blank' rel="noopener noreferrer">PR.</a>
        </footer>
      </div>
    );
  }
}

export default App;
