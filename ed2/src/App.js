import React, { Component } from 'react';
import { DragSource } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import { DragDropContainer } from 'react-drag-drop-container';
import Dragbutton from './Dragbutton';
import Grid from 'react-bootstrap/lib/Grid';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';

import Navigationbar from './Navigationbar';
import FloatingTeleop from './FloatingTeleop';
import FloatingHeadTeleop from './FloatingHeadTeleop';

import './App.css';

import logo from './logo.svg';

class App extends Component {
  render() {
    return [
      <Navigationbar />,
      <Grid fluid={true} className="App-grid">
        <Row className="App-row">
          <Col xs={12} md={8} className="App-main">
            left
          </Col>
          <Col xs={6} md={4} className="App-aside">
            <DragDropContainer returnToBase={true}>
              <div>Look, I'm Draggable!</div>
            </DragDropContainer>
            <DragDropContainer returnToBase={true}>
              <div>Look, I'm Draggable!</div>
            </DragDropContainer>
            <DragDropContainer returnToBase={true}>
              <div>Look, I'm Draggable!</div>
            </DragDropContainer>
            <DragDropContainer returnToBase={true}>
              <div>Look, I'm Draggable!</div>
            </DragDropContainer>
            <DragDropContainer returnToBase={true}>
              <div>Look, I'm Draggable!</div>
            </DragDropContainer>
          </Col>
        </Row>
      </Grid>,
      <FloatingTeleop className="App-FloatingTeleop" />,
      <FloatingHeadTeleop className="App-FloatingHeadTeleop" />,
    ];
  }
}

export default DragDropContext(TouchBackend({ enableMouseEvents: true }))(App);
// export default DragDropContext(HTML5Backend)(App);
