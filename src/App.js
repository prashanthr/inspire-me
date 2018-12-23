import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.inspire = this.inspire.bind(this)
    this.state = {
      img: null
    }
  }
  inspire () {
    axios
      .get('/.netlify/functions/inspire')
      .then(res => this.setState({ img: res.data.data }))
  }
  componentWillMount () {
    this.inspire()
  }
  render() {
    return (
      <div className="App">
        <div className="App-content">
          {!this.state.img && `Loading...`}
          {this.state.img && 
            <img alt='inspire-strip' src={this.state.img} />
          }
          <br /><br />
          <button 
            class='inspire-button' 
            onClick={this.inspire}
          >
            Inspire Me
          </button>
        </div>
        <footer className='footer'>Copyright © PR.</footer>
      </div>
    );
  }
}

export default App;
