import React, { Component } from 'react';

const axios = require('axios');

class ProfilePic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }

  async onFormSubmit(event) {
    event.preventDefault();
    const { file } = this.state;
    console.log(file);
    await this.fileUpload(file).then((response) => {
      console.log(response.data);
    });
  }

  onChange(event) {
    this.setState({ file: event.target.files[0] });
  }

  async fileUpload(file) {
    const url = 'http://localhost:3000/api/upload';
    const formData = new FormData();
    formData.append('file', file);
    console.log(formData);
    // const body = { list: formData };
    const config = {
      headers: {
        'Content-type': 'multipart/form-data',
      },
    };
    await axios.patch(url, formData, config).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
        <h1>File Upload</h1>
        <input type="file" onChange={this.onChange} />
        <button type="submit">Upload</button>
      </form>
    );
  }
}

export default ProfilePic;
