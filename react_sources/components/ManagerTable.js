import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';

import UserDataModel from '../models/UserDataModel';

export default class ManagerTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let list = [];

    //console.log(this.props.db.all);

    for (const [id_str, user] of this.props.db.all) {
      list.push(<li key={id_str}>{JSON.stringify(user)}</li>);
    }

    return <ul>
      {list}
    </ul>;
  }
}