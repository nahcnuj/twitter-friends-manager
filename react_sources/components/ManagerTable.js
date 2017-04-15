import ReactDOM from 'react-dom';
import React from 'react';
import $ from 'jquery';

import UserDataModel from '../models/UserDataModel';

export default class ManagerTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let list = [];

    for (const [id_str, user] of this.props.data) {
      list.push(<li key={id_str}>{JSON.stringify(user)}</li>);
    }

    return <ul>
      {list}
    </ul>;
  }
      /*<table className="table table-striped table-condensed manager">
        <thead>
          <tr>
          <th colSpan="2">アカウント</th>
          <th>プロフィール</th>
          <th colSpan="2">最近のツイート</th>
          <th>フォロー</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>*/
}