import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
import { Button } from 'react-bootstrap';

const style = {
  position: 'absolute',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
};

const cardSource = {
  beginDrag(props) {
    return {
      text: props.text,
    };
  },
};

class DragButton extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,

    // Injected by React DnD:
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { isDragging, connectDragSource, children } = this.props;
    return connectDragSource(
      <div style={{ ...style, opacity: isDragging ? 0.5 : 1 }}>{children}</div>,
    );
  }
}

export default DragSource('const', cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DragButton);
