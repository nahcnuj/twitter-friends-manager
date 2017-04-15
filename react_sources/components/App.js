import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import Request from 'superagent';

import UserDataModel from '../models/UserDataModel';

import ManagerTable from './ManagerTable';
import AlertBox from './AlertBox';
import Button from './Button';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    let queue = JSON.parse(localStorage.getItem('queue')) || [];
    let nextCursorStr = queue.length === 0
                ? "-1"
                : (JSON.parse(localStorage.getItem('next')) || "-1");

    this.state = {
      database: new UserDataModel(),
      queue: queue,
      next_cursor_str: nextCursorStr,
      isDone: false
    };

    this.reset = this.reset.bind(this);
    this.reload = this.reload.bind(this);
  }

  componentDidMount() {
    let _this = this;
    this.database = new UserDataModel(new Map(JSON.parse(localStorage.getItem('followings')) || []),
                                      (newDB) => _this.updateDatabase(newDB));
    this.reload();
  }

  render() {
    return <div>
        <AlertBox error={this.state.error} />
        <ManagerTable data={this.state.data} db={this.state.database} />
      </div>;
  }


  updateDatabase(newDB) {
    this.setState({database: newDB});
    localStorage.setItem('followings', newDB.toString());
  }

  reset() {
    this.setState({queue: []});
    this.database.clear();
  }

  reload() {
    this.getFollowingIds(this.state.next_cursor_str);
  }

  getNumberOfFollowings() {
    let _this = this;
    return new Promise(
      (resolve, reject) => {
        Request.get('/count/following')
          .then((res) => {
              _this.setState({count: parseInt(res.text, 10)});
            })
          .catch((err) => {
              _this.setState({error: err.response.text});
            });
      }
    );
  }

  getFollowingIds(nextCursorStr = '-1') {
    let _this = this;
    return new Promise(
      (resolve, reject) => {
        Request.get('/ids/following')
          .query({next_cursor_str: nextCursorStr})
          .then(({text}) => {
              let {ids, next_cursor_str} = JSON.parse(text);
              ids.forEach((elem, idx, arr) => {
                  _this.database.add({id_str: elem});
                });
              _this.getLastestTweets(ids);
            })
          .catch((err) => {
              _this.setState({error: err.response.text});
            });
      }
    );
  }

  getLastestTweets(ids) {
    let _this = this;
    let sliced = [];
    const unit = 10; // up to 100
    
    for (let i = 0; i < ids.length; i += unit) {
      sliced.push(ids.slice(i, i + unit));
    }
    return Promise.all(sliced.map(
        (ids) => new Promise(
          (resolve, reject) => {
            Request.post('/tweets')
              .send({ids: ids})
              .then(({text: res}) => {
                  let arr = JSON.parse(res);
                  arr.forEach((elem, idx, arr) => {
                      _this.database.add(elem);
                    });
                })
              .catch((err) => {
                  console.log(err);
                  _this.setState({error: err.response.text});
                })
          }
        )
      ));
  }
}