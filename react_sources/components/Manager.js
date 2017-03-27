import ReactDOM from 'react-dom';
import React from 'react';
import Twitter from 'twitter';

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  componentDidMount() {
  }

  render() {
    return(
      <table className="table table-striped table-condensed manager">
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
      </table>
    );
  }
}