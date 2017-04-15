import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';

import UserDataModel from '../models/UserDataModel';
import ManagerTable from './ManagerTable';

export default class Manager extends React.Component {
  constructor(props) {
    super(props);

    let queue = JSON.parse(localStorage.getItem('queue')) || [];
    let next = queue.length === 0
                ? -1
                : (JSON.parse(localStorage.getItem('next')) || -1);
    
    let {access_token: token, access_token_secret: secret} = cookie.load('oauth');


    this.state = {
      db: new UserDataModel(),
      access_token: token,
      access_token_secret: secret,
      queue: queue,
      next: next,
      isDone: false
    };
  }

  loadFollowings(nextCursor = -1) {
    if (nextCursor === '0') {
      return;
    }

    $.ajax({
      url: '/load/friends',
      data: {
          cursor: nextCursor,
          token: this.props.token,
          secret: this.props.secret
        },
      dataType: 'json',
      cache: false,
      success: ({users: users, next: next}) => {
          this.setState({
            queue: this.state.queue.concat(users)
          });
          
          localStorage.setItem('following_next', next);

          let delay = this.state.needDelay ? 60000 : 0;
          setTimeout(() => { this.loadFollowings(next); }, delay);
        },
      error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
    });
  }

  getNumberOfFollowings() {
    $.ajax({
      url: '/count/following',
      dataType: 'text',
      cache: false,
      success: (result) => {
          let count = parseInt(result, 10);
          this.setState({count: count, needDelay: count > 900});
        },
      error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
    })
  }

  loadLastTweets() {
    console.debug(this.state.queue.length);
    if (this.state.queue.length <= 0) {
      return;
    }

    let [user, ...rest] = this.state.queue;
    $.ajax({
        url: '/load/last_tweet',
        data: {
            screen_name: user.screen_name,
            token: this.state.access_token,
            secret: this.state.access_token_secret,
          },
        dataType: 'json',
        cache: false,
        error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
      })
      .then((result) => {
        user.last_tweet = result;
        this.db.add(user);

        this.setState({queue: rest});
        localStorage.setItem('queue', JSON.stringify(rest));
        
        //setTimeout(() => { this.loadLastTweets(); }, 1200);
      });
  }
  
  componentDidMount() {
    this.db = new UserDataModel(new Map(JSON.parse(localStorage.getItem('database')) || []),
        ((newDB) => {
          this.db = newDB;
          this.setState({db: newDB});
          localStorage.setItem('database', newDB.toString());
          //console.debug('database: '+newDB.toString());
          //console.debug('localstorage: '+JSON.parse(localStorage.getItem('database')));
        }).bind(this)
      );

    this.reload();
  }

  reload() {
    Promise.all([
      new Promise(() => this.getNumberOfFollowings()),
      new Promise(() => this.loadFollowings()),
      //new Promise(() => setTimeout(this.loadLastTweets(), 1000))
    ]);
  }

  render() {
    return <div>
        <p>Queue: {this.state.queue.length}</p>
        <p>Stored: {this.state.db.size}</p>
        <p>Friends: {this.state.count}</p>
        <p>
          <a className="btn btn-twitter" onClick={(e) => { this.setState({queue: []}); this.db.clear(); }}>
            clear
          </a>
          <a className="btn btn-twitter" onClick={(e) => { this.reload(); }}>
            reload
          </a>
        </p>
        <ManagerTable data={this.state.data} db={this.state.db} />
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