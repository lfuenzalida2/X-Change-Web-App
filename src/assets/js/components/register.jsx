/* eslint-disable camelcase */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';

const axios = require('axios');

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errors: [],
    };
    this.componentDidMount = this.componentDidMount.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  async submitForm(event) {
    event.preventDefault();
    const { url } = this.props;
    const {
      username, mail, password, confirm_password, number, region, profile_picture,
    } = event.target;
    const ur = `${url}/users`;
    const body = {
      username: username.value,
      mail: mail.value,
      password: password.value,
      confirm_password: confirm_password.value,
      number: number.value,
      region: region.value,
      profile_picture: profile_picture.value,
    };
    await axios.post(ur, body)
      .then(async () => {
        window.location.replace(`${url}/session/new`);
      })
      .catch((err) => {
        const { errors } = err.response.data;
        const list = [];
        errors.forEach((error) => {
          list.push(error.message);
        });
        this.setState({ errors: list });
      });
  }

  render() {
    const { loading, errors } = this.state;
    if (loading) return ('');

    return (
      <>
        <div className="flex-item bg-gray">
          <div>
            {errors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
          <form onSubmit={this.submitForm} method="post" className="border form">
            <div>
              <label htmlFor="username" className="">Nombre de usuario</label>
              <input type="text" name="username" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <label htmlFor="mail">Correo electrónico</label>
              <input type="text" name="mail" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <label htmlFor="password">Contraseña</label>
              <input type="password" name="password" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <label htmlFor="confirm_password">Confirmar Contraseña</label>
              <input type="password" name="confirm_password" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <label htmlFor="number">Número de teléfono</label>
              <input type="number" name="number" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <label htmlFor="region">Región</label>
              <select name="region" id="region" className="float-r">
                <option value="Metropolitana de Santiago">Metropolitana de Santiago</option>
                <option value="Aisen del G. Carlos Ibáñez del Campo">Aisén del G. Carlos Ibáñez del Campo</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Atacama">Atacama</option>
                <option value="Biobio">Biobío</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="La Araucania">La Araucanía</option>
                <option value="Libertador General Bernardo O'Higgins">Libertador General Bernardo O'Higgins</option>
                <option value="Los Lagos">Los Lagos</option>
                <option value="Los Rios">Los Ríos</option>
                <option value="Magallanes y de la Antartica Chilena">Magallanes y de la Antártica Chilena</option>
                <option value="Nuble">Ñuble</option>
                <option value="Tarapaca">Tarapacá</option>
                <option value="Valparaiso">Valparaíso</option>
              </select>
            </div>
            <br />
            <div>
              <label htmlFor="profile_picture">Foto de perfil</label>
              <input type="text" name="profile_picture" className="float-r" />
            </div>
            <br />
            <br />
            <div>
              <input type="submit" name="create" value="Crear cuenta!" className="btn" />
            </div>
          </form>
          <br />
        </div>
      </>
    );
  }
}

export default RegisterForm;
