import React, { Component } from 'react';
import "./Doorbell.css"

class Doorbell extends Component {
  render() {
    return (
      <button className="doorbell" {...this.props}></button>
    );
  }
}

export default Doorbell;
