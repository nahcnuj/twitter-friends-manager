import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <p>{JSON.stringify(this.props.data)}</p>;
  }
}