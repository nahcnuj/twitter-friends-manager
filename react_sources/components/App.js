import ReactDOM from 'react-dom';
import React from 'react';
import Twitter from 'twitter';

export default class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
      this.state = {
          port: process.env.CONSUMER_KEY
      };
  }

  render() {
      console.log(process.env);
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