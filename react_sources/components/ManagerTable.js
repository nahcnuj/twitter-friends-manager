import ReactDOM from 'react-dom';
import React from 'react';
import Moment from 'moment';

import UserDataModel from '../models/UserDataModel';
import FollowButton from './FollowButton';

const glyphiconStyle = {margin: '0 0.5ex'};
const lockIcon = <span className='glyphicon glyphicon-lock' style={glyphiconStyle}></span>;
const verifiedIcon = <span className='glyphicon glyphicon-ok-sign' style={glyphiconStyle}></span>;

export default class ManagerTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let body = [];
    let list = [];

    for (const [id_str, user] of this.props.data) {
      if (typeof user === 'undefined') {
        continue;
      }
      
      body.push(
        <tr key={id_str}>
          <td><a href={'https://twitter.com/'+user.screen_name} className='no-hover'>
            <img src={user.profile_image_url_https} className='profile-image' />
          </a></td>
          <td><a href={'https://twitter.com/'+user.screen_name} className='no-hover'>
            <small className='text-muted'>
              @{user.screen_name}
              {user.protected ? lockIcon : null}
              {user.verified ? verifiedIcon : null}
            </small><br />
            {user.name}
          </a></td>
          <td className='description-cell'>
            {user.description}
          </td>
          <td>
            {user.status.text}<br />
            <small>{new Moment(new Date(user.status.created_at)).format('YYYY/MM/DD HH:mm:ss [(UTC]Z[)]')}</small>
          </td>
          <td>
            <FollowButton
              targetScreenName={user.screen_name}
              following={user.following}
              onChanged={(e) => this.forceUpdate()} />
          </td>
        </tr>
      );
      list.push(<li key={id_str}>{JSON.stringify(user)}</li>);
    }

    return (
      <table className='table table-striped table-condensed manager' style={{width:'100%',maxWidth:'100%'}}>
        <colgroup>
          <col className='account-column' span='2' />
          <col className='profile-column' />
          <col className='tweet-column' />
          <col className='follow-column' />
        </colgroup>
        <thead>
          <tr>
          <th colSpan='2'>アカウント</th>
          <th>プロフィール</th>
          <th>最近のツイート</th>
          <th>フォロー</th>
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </table>
    );
  }
}