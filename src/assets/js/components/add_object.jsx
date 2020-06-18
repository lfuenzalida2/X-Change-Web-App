/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-classes-per-file */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';

const axios = require('axios');

class ObjectForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      form: false,
      categories: null,
      loading: true,
      errors: [],
    };
    this.ToogleForm = this.ToogleForm.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.getCategories = this.getCategories.bind(this);
  }

  async getCategories() {
    const { url } = this.props;
    await axios({
      method: 'get',
      url: `${url}/api/categories`,
    })
      .then(async (res) => {
        this.setState({ categories: res.data.data, loading: false });
      }, (err) => {
        console.log(err);
      });
  }

  async ToogleForm() {
    const { categories } = this.state;
    if (!categories) {
      await this.getCategories();
    }
    this.setState((prevState) => ({
      form: !prevState.form,
    }));
  }

  async submitForm(event) {
    event.preventDefault();
    const { url } = this.props;
    const { name, categoryId, description } = event.target;
    const ur = `${url}/api/object_create`;
    const body = {
      name: name.value, categoryId: categoryId.value, description: description.value,
    };
    await axios.post(ur, body)
      .then(async (res) => {
        console.log(res);
        this.ToogleForm();
        alert('Se ha agregado correctamente su articulo');
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
    const {
      form, categories, loading, errors,
    } = this.state;
    if (!form) {
      return (
        <div className="header clickable">
          <a onClick={this.ToogleForm} className="flexbox-item">
            <img className="navbar-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/publish.png" alt="add_object_form" />
            <span className="item">Publicar</span>
          </a>
        </div>
      );
    }

    if (loading) return ('');
    console.log(errors);
    return (
      <>
        <div className="header clickable">
          <a onClick={this.ToogleForm} className="flexbox-item">
            <img className="navbar-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/publish.png" alt="add_object_form" />
            <span className="item">Publicar</span>
          </a>
        </div>
        <div className={form ? ('dropdown') : ('hidden')}>
          <div>
            {errors.map((error) => (
              <p>{error}</p>
            ))}
          </div>
          <DropdownForm categories={categories} submitForm={this.submitForm} />
        </div>
      </>
    );
  }
}

class DropdownForm extends Component {
  render() {
    const { categories, submitForm } = this.props;
    return (
      <div className="form">
        <form onSubmit={submitForm}>
          <input type="hidden" name="_method" value="patch" />
          <input type="hidden" name="views" value="0" />
          <input type="hidden" name="state" value="true" />
          <input type="hidden" name="userId" value="currentUser.id" />
          <div className="field">
            <input type="text" name="name" placeholder="Ingrese el nombre del objeto" className="float-r" />
          </div>
          <br />
          <br />
          <div>
            <select name="categoryId" id="categoryId" className="float-r" defaultValue="">
              <option value="" disabled>Selecciones una categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.attributes.id}>{category.attributes.name}</option>
              ))}
            </select>
          </div>
          <br />
          <br />
          <div className="field">
            <input type="textarea" name="description" placeholder="Ingrese una descripción" className="float-r" />
          </div>
          <br />
          <br />
          <div className="field">
            <input type="submit" name="create" value="Crear" />
          </div>
        </form>
      </div>
    );
  }
}


export default ObjectForm;