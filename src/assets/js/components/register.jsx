import React, { Component } from 'react';

const axios = require('axios');

// eslint-disable-next-line react/prefer-stateless-function
export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };
  }

  render() {
    const { loading } = this.state;
    if (loading) return <p>Loading...</p>;
    return (<p> form </p>);
  }
}
