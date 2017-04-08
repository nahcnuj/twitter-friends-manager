import ReactDOM from 'react-dom';
import React from 'react';
import cookie from 'react-cookie';
import $ from 'jquery';
//import Twitter from 'twitter';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    let oauthData = cookie.load('oauth', true);
    if (oauthData !== undefined) {
      this.state = {
        oauth: JSON.parse(oauthData)
      };
    }
    else {
      this.state = {
        oauth: undefined
      };
    }
  }

  componentWillMount() {
    /*$.ajax({
      url: '/',
      dataType: 'json',
      cache: false,
      success: (data) => { this.setState({oauth: JSON.stringify(data)}); },
      error: (xhr, status, err) => { console.error(this.props, status, err.toString()); }
    });*/
  }

  render() {
    if (!this.state.oauth) {
      return <div>
          <p className="lead">Twitter のフォロー管理を支援するツールです。</p>
          <p className="text-center">
          <a className="btn btn-social btn-twitter btn-lg" href="/auth/twitter">
            <span className="fa fa-twitter"></span>
            Sign in with Twitter
          </a></p>
        </div>;
    }

    return(<p>{JSON.stringify(this.state.oauth)}</p>);
  }
}