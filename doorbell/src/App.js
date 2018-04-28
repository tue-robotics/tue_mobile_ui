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
  constructor(props) {
    super(props);
    this.state = {
      status: 'connecting',
    };
  }
  componentWillMount() {
    this.ros = new Ros({
      encoding: 'ascii',
      url: defaultUrl,
    });

    this.ros.on('connection', () => {
      console.log('connection');
      this.setState({
        status: 'connected',
      });
    });

    this.ros.on('error', () => {
      console.log('error');
      this.setState({
        status: 'error',
      });
    });

    this.ros.on('close', () => {
      console.log('close');
      this.setState({
        status: 'error',
      });

      // reconnect behavior
      setTimeout(() => {
        this.setState({
          status: 'connected',
        });
        this.ros.connect(defaultUrl);
      }, RECONNECT_TIMEOUT);
    });

    this.topic = this.ros.Topic({
      name: 'trigger',
      messageType: 'std_msgs/String',
    });
  }

  handleClick = () => {
    console.log('doorbell');
    this.topic.publish({
      data: 'doorbell',
    });
  };

  render() {
    return (
      <div className="App">
        <div className={'App-status ' + this.state.status} />
        <p className="App-intro">
          <Doorbell onClick={this.handleClick} />
        </p>
      </div>
    );
  }
}

export default App;
