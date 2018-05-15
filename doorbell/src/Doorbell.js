import React, { Component } from 'react';

class Doorbell extends Component {
  render() {
    return (
      <button {...this.props}>
        <img src="doorbell.png" alt="Doorbell" />
      </button>
    );
  }
}

export default Doorbell;
