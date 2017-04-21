import ReactDOM from 'react-dom';
import React from 'react';
import Cookie from 'react-cookie';
import Request from 'superagent';
import Pager from 'react-pager';

import UserDataModel from '../models/UserDataModel';

import Manager from './Manager';
import AlertBox from './AlertBox';

const pagerTitles = {first: 'First', last: 'Last', prev: '<', next: '>', prevSet: '<<', nextSet: '>>'};

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.pageChangedHandler = this.pageChangedHandler.bind(this);
    this.updateDatabase = this.updateDatabase.bind(this);
    this.reset = this.reset.bind(this);
    this.reload = this.reload.bind(this);
    
    let options = Cookie.load('options') || {
        usersPerPage: 20
      };
    
    this.state = {
      totalPages: 1,
      currentPage: 0,
      visiblePages: 5,
      options: options,
      database: new UserDataModel(),
      isDone: false
    };
  }

  componentDidMount() {
    let _this = this;

    let data = new Map();//new Map(JSON.parse(localStorage.getItem('followings')));
    this.database = new UserDataModel(data, this.updateDatabase);
    this.setState({database: this.database});
    
    this.reload();
  }

  render() {
    const pager = (
      <div className='text-center'>
        <Pager
          total={this.state.totalPages}
          current={this.state.currentPage}
          visiblePages={this.state.visiblePages}
          titles={pagerTitles}
          onPageChanged={this.pageChangedHandler} />
      </div>
    );

    return <div>
        {this.state.isDone ? null : <p className='alert'>Now loading...</p>}
        <AlertBox error={this.state.error} />
        {pager}
        <Manager
          data={this.state.database}
          currentPage={this.state.currentPage}
          options={this.state.options} />
        {pager}
      </div>;
  }


  pageChangedHandler(newPage) {
    this.setState({currentPage: newPage});
  }

  updateDatabase(newDB) {
    this.setState({
      totalPages: Math.floor(newDB.data.size/this.state.options.usersPerPage + 0.9),
      database: newDB
    });
    //localStorage.setItem('followings', newDB.toString());
  }


  reset() {
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
              console.log(err);
              _this.setState({error: err.response.text});
            });
      }
    );
  }

  getFollowingIds(nextCursorStr = '-1') {
    if (nextCursorStr === '0') {
      return;
    }

    let _this = this;

    return new Promise(
      (resolve, reject) => {
        Request.get('/ids/following')
          .query({next_cursor_str: nextCursorStr})
          .then(({text}) => {
              let {ids, next_cursor_str} = JSON.parse(text);
              _this.getLastestTweets(ids);
              _this.database.set(ids);
              _this.getFollowingIds(next_cursor_str);
            })
          .catch((err) => {
              console.log(err);
              _this.setState({error: err.response.text});
            });
      }
    );
  }

  getLastestTweets(ids) {
    let _this = this;

    const idsPerRequest = 100;
    
    let sliced = [];
    for (let i = 0; i < ids.length; i += idsPerRequest) {
      sliced.push(ids.slice(i, i + idsPerRequest));
    }

    return Promise.all(sliced.map(
        (ids) => new Promise(
          (resolve, reject) => {
            Request.post('/tweets')
              .send({ids: ids})
              .then(({text: res}) => {
                let tweets = JSON.parse(res);
                _this.database.set(tweets);
                resolve();
              })
          }
        )
      ))
      .then(() => _this.setState({isDone: true}))
      .catch((err) => {
          console.log(err);
          _this.setState({error: err.response.text});
        });
  }
}