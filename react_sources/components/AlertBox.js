import ReactDOM from 'react-dom';
import React from 'react';

export default class AlertBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.error) {
      return <p className='alert alert-danger'>{this.props.error}</p>;
    }
    
    return null;
  }
}