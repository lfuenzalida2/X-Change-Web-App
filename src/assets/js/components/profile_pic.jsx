import React, { Component } from 'react';

const axios = require('axios');

class ProfilePic extends Component {
  constructor(props) {
    super(props);

    this.state = {
      file: null,
      currentUser: null,
      loading: true,
      errors: [],
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  async componentDidMount() {
    await this.loadUser();
  }

  async onFormSubmit(event) {
    event.preventDefault();
    const { file } = this.state;
    await this.fileUpload(file).then((response) => {
      console.log(response.data);
    });
  }

  onChange(event) {
    this.setState({
      file: event.target.files[0],
    });
  }

  async loadUser() {
    let { url } = this.props;
    url = `${url}/api/current_user`;
    await axios.get(url)
      .then((response) => {
        const { data } = response.data;
        this.setState({
          currentUser: {
            id: parseInt(data.id, 10),
            username: data.attributes.username,
            profilePicture: data.attributes['profile-picture'],
          },
          loading: false,
        });
      })
      .catch((error) => {
        const { errors } = error.response.data;
        const list = [];
        errors.forEach((err) => {
          list.push(err.message);
        });
        this.setState({ errors: list });
      });
  }

  async fileUpload(file) {
    this.setState({
      loading: true,
    });
    let { url } = this.props;
    url = `${url}/api/upload`;
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      headers: {
        type: 'image/png',
      },
    };
    await axios.patch(url, formData, config).then((res) => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    });
    await this.loadUser();
  }

  render() {
    const { loading, currentUser, errors } = this.state;
    if (loading) return <p> Loading.. </p>;
    return (
      <div id="image_profile">
        <img src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${currentUser.profilePicture}`} alt="profile" />
        <div>
          {errors.map((error) => (
            <p key={error}>{error}</p>
          ))}
        </div>
        <h3>Subir foto</h3>
        <form onSubmit={this.onFormSubmit}>
          <input type="file" onChange={this.onChange} />
          <button type="submit" className="btn">Subir</button>
        </form>
      </div>
    );
  }
}

export default ProfilePic;
