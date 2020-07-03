import React, { Component } from 'react';

const axios = require('axios');

function Valid(string) {
  if (string.length < 8) {
    return false;
  }
  let cap = false;
  let num = false;
  for (let i = 0; i < string.length; i++) {
    const element = string[i];

    if (element === element.toUpperCase()) {
      cap = true;
    } else if (typeof Number(element) === 'number') {
      num = true;
    }
  }
  if (cap && num) {
    return true;
  }
}

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      errors: [],
      samePassword: '',
    };

    this.passwordRef = React.createRef();
    this.passwordConfirmRef = React.createRef();
    this.componentDidMount = this.componentDidMount.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.checkPassword = this.checkPassword.bind(this);
    this.validPassword = this.validPassword.bind(this);
    this.validEmail = this.validEmail.bind(this);
    this.validUsername = this.validUsername.bind(this);
    this.validNumber = this.validNumber.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: false });
  }

  validNumber(event) {
    const number = event.target.value;
    const list = [];
    if (number.length !== 8) {
      list.push('El numero de telefono utilizado es muy corto, debe tener 8 numeros');
    }
    this.setState({ errors: list });
  }

  validUsername(event) {
    const username = event.target.value;
    const list = [];
    if (username.length < 4) {
      list.push('El nombre de usuario elegido es muy corto, debe tener mas de 4 caracteres');
    } else if (username.length > 50) {
      list.push('El nombre de usuario elegido es muy largo, debe tener menos de 50 caracteres');
    }
    this.setState({ errors: list });
  }

  validEmail(event) {
    const mail = event.target.value;
    const list = [];
    if (mail.indexOf('@') === -1) {
      list.push('El correo electronico ingresado no es valido');
    }

    // Setting errors
    this.setState({ errors: list });
  }

  validPassword() {
    const password = this.passwordRef.current.value;
    const list = [];
    if (password.length < 8) {
      list.push('La contraseña es muy corta, esta debe tener mínimo 8 caracteres');
    } if (!Valid(password)) {
      list.push('La contraseña debe contener almenos un caracter en mayúscula y un número');
    }

    // Setting errors
    this.setState({ errors: list });
  }

  checkPassword() {
    this.validPassword();
    if (this.passwordRef.current.value === '' || this.passwordConfirmRef.current.value === '') {
      this.setState({ samePassword: '' });
    } else if (this.passwordConfirmRef.current.value !== this.passwordRef.current.value) {
      this.setState({ samePassword: 'diffPassword' });
    } else {
      this.setState({ samePassword: 'samePassword' });
    }
  }

  async submitForm(event) {
    event.preventDefault();
    const { url } = this.props;
    const {
      username, mail, password, confirmPassword, number, region,
    } = event.target;
    const ur = `${url}/users`;
    const body = {
      username: username.value,
      mail: mail.value,
      password: password.value,
      confirm_password: confirmPassword.value,
      number: number.value,
      region: region.value,
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
    const { loading, errors, samePassword } = this.state;
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
            <h1 className="center title-register">Regístrate</h1>
            <div className="center">
              <input placeholder="Nombre de usuario" className="input-register" type="text" name="username" onBlurCapture={this.validUsername} />
            </div>
            <div className="center">
              <input placeholder="Mail" className="input-register" type="text" name="mail" onBlurCapture={this.validEmail} />
            </div>
            <div className="center">
              <input placeholder="Contraseña" type="password" name="password" className={`${samePassword} input-register`} ref={this.passwordRef} onBlurCapture={this.checkPassword} />
            </div>
            <div className="center">
              <input placeholder="Confirmar contraseña" type="password" name="confirmPassword" className={`${samePassword} input-register`} ref={this.passwordConfirmRef} onChange={this.checkPassword} />
            </div>
            <div className="center">
              <input placeholder="Teléfono" className="input-register" type="number" name="number" onBlurCapture={this.validNumber} />
            </div>
            <div className="center">
              <select name="region" id="region" className="dropdown input-register">
                <option disabled selected>Región</option>
                <option value="Metropolitana de Santiago">Metropolitana de Santiago</option>
                <option value="Aisen del G. Carlos Ibáñez del Campo">Aisén del G. Carlos Ibáñez del Campo</option>
                <option value="Antofagasta">Antofagasta</option>
                <option value="Arica y Parinacota">Arica y Parinacota</option>
                <option value="Atacama">Atacama</option>
                <option value="Biobio">Biobío</option>
                <option value="Coquimbo">Coquimbo</option>
                <option value="La Araucania">La Araucanía</option>
                <option value="Libertador General Bernardo O'Higgins">Libertador General Bernardo O&apos;Higgins</option>
                <option value="Los Lagos">Los Lagos</option>
                <option value="Los Rios">Los Ríos</option>
                <option value="Magallanes y de la Antartica Chilena">Magallanes y de la Antártica Chilena</option>
                <option value="Nuble">Ñuble</option>
                <option value="Tarapaca">Tarapacá</option>
                <option value="Valparaiso">Valparaíso</option>
              </select>
            </div>
            <div className="center">
              <input type="submit" name="create" value="Crear cuenta" className="btn" />
            </div>
          </form>
        </div>
      </>
    );
  }
}

export default RegisterForm;
