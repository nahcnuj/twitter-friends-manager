import ReactDOM from 'react-dom';
import React from 'react';

import UserDataModel from '../models/UserDataModel';
import ManagerTable from './ManagerTable';

export default class Manager extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let startIdx = this.props.currentPage * this.props.options.usersPerPage;
    let data = this.props.data.subarray(startIdx, startIdx + this.props.options.usersPerPage);
    return <div>
        <ManagerTable data={data} />
      </div>;
  }
  

  filter(data, option) {
    let startIdx = this.state.currentPage * option.usersPerPage;
    data = Array.from(data).slice(startIdx, startIdx + option.usersPerPage);
    return data;
  }
}