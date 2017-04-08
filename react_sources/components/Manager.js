import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';

import ManagerTable from './ManagerTable';

export default class Manager extends React.Component {
  constructor(props) {
    super(props);

    let followings = JSON.parse(localStorage.getItem('following_users')) || [];
    let followingNext = localStorage.getItem('following_next') || -1;

    this.state = {
      data: followings,
      nextCursor: followingNext,
      isDone: false
    };
  }

  loadData(nextCursor = -1) {
    let {access_token: token, access_token_secret: secret} = cookie.load('oauth');

    $.ajax({
      url: '/load',
      data: {
          cursor: nextCursor,
          token: token,
          secret: secret,
          needDelay: this.state.needDelay
        },
      dataType: 'json',
      cache: false,
      success: ({data: data, next: next}) => {
          let newData = this.state.data.concat(data);

          localStorage.setItem('following_users', JSON.stringify(newData));
          localStorage.setItem('following_next', next);

          let isLast = next === 0;
          this.setState({
            data: newData,
            nextCursor: next,
            isDone: isLast
          });

          let delay = this.state.needDelay ? 60000 : 0;
          if (!isLast) {
            setTimeout(() => {this.loadData(next);}, delay);
          }
        },
      error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
    });
  }

  componentDidMount() {
    let {access_token: token, access_token_secret: secret} = cookie.load('oauth');

    $.ajax({
      url: '/load/delay',
      data: {
        token: token,
        secret: secret
      },
      dataType: 'text',
      cache: false,
      success: (result) => {
          let count = parseInt(result, 10);
          this.setState({count: count, needDelay: count > 900});
          return count;
        },
      error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
    })
    .then((count) => {
      if (this.state.nextCursor !== 0) {
        this.loadData(this.state.nextCursor);
      }
    });
  }

  render() {
    return <div>
        {this.state.isDone ? (<p>Done.</p>) : (<p>Now loading... ({this.state.data.length} / {this.state.count})</p>)}
        <ManagerTable data={this.state.data}/>
      </div>
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
    ;
  }
}