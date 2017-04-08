import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';

import Manager from './Manager';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      oauth: cookie.load('oauth')
    };
  }

  render() {
    let oauth = this.state.oauth;

    if (!oauth) {
      return <div>
          <p className="lead">Twitter のフォロー管理を支援するツールです。</p>
          <p className="text-center">
          <a className="btn btn-social btn-twitter btn-lg" href="/auth/twitter">
            <span className="fa fa-twitter"></span>
            Sign in with Twitter
          </a></p>
        </div>;
    }

    return <Manager token={oauth.access_token} secret={oauth.access_token_secret} />;
  }
}