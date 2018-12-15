import React, { Component } from 'react';
import logo from './logo.svg';
import axios from 'axios'
import './App.css';

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      img: null
    }
  }
  componentWillMount () {
    axios.get('/.netlify/functions/inspire').then(res => this.setState({ img: res.data.data }))
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {this.state.img && 
            <img alt='inspire-strip' src={this.state.img} />
          }
        </header>
      </div>
    );
  }
}

export default App;
