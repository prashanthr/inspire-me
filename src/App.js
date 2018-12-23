import React, { Component } from 'react';
import axios from 'axios'
import './App.css';

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

  inspire () {
    this.setState({
      loading: true
    })
    axios
      .get('/.netlify/functions/inspire')
      .then(res => this.updateImg(res.data.data))
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
          <br /><br />
          {this.state.loading 
            ? (<div className='spinner' />)
            : (
              <button
                className='inspire-button' 
                onClick={this.inspire}
              >
                Inspire Me
              </button>
            )
          }
        </div>
        <footer className='footer'>Copyright © PR.</footer>
      </div>
    );
  }
}

export default App;
