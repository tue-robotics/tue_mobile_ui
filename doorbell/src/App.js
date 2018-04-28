import React, { Component } from 'react';
import { Topic, Ros } from 'roslib';
import Doorbell from './Doorbell';
import './App.css';
import { hostname } from 'os';

const RECONNECT_TIMEOUT = 2000;

// Private variables
const host = hostname() || 'localhost';
const defaultUrl = `ws://${host}:9090`;

class App extends Component {
  componentWillMount() {
    this.ros = new Ros({
      encoding: 'ascii',
      url: defaultUrl,
    });

    // reconnect behavior
    this.ros.on('error', () =>
      setTimeout(() => this.ros.connect(defaultUrl), RECONNECT_TIMEOUT),
    );

    this.ros.on('connection', () => {
      console.log('connection');
    });

    this.topic = this.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });
  }

  handleClick = () => {
    console.log('this is:', this);
    this.topic.publish({
      data: 'doorbell',
    });
  };

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          <Doorbell onClick={this.handleClick} />
        </p>
      </div>
    );
  }
}

export default App;
