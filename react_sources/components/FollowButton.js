import ReactDOM from 'react-dom';
import React from 'react';
import Request from 'superagent';

export default class FollowButton extends React.Component {
  constructor(props) {
    super(props);

    this.unfollow = this.unfollow.bind(this);
  }

  render() {
    return (
      <button
        onClick={this.unfollow}
        className={'btn btn-sm' + (this.props.following ? '' : ' btn-twitter')}>
        {this.props.following ? 'Unfollow' : 'Follow'}
      </button>
    );
  }

  unfollow() {
    console.log(this.props.targetScreenName);

    Request.post('/unfollow')
      .send({screen_name: this.props.targetScreenName})
      .then((result) => {
          console.log(result);
          this.props.onChanged(!this.props.following);
        })
      .catch((err) => {
          console.error(err);
          //_this.setState({error: err.response.text});
        })
  }
}