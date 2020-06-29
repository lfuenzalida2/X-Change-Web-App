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
        const { id } = res.data;
        window.location.replace(`${url}/inventory/${id}`);
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
    return (
      <>
        <div className="header clickable">
          <a onClick={this.ToogleForm} className="flexbox-item">
            <img className="navbar-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/publish.png" alt="add_object_form" />
            <span className="item">Publicar</span>
          </a>
        </div>
        <div className={form ? ('modal') : ('hidden')}>
          <div className="modal-content">
            <span className="close" onClick={this.ToogleForm}>Close</span>
            <div>
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
            <Form categories={categories} submitForm={this.submitForm} />
          </div>
        </div>
      </>
    );
  }
}

function Form(props) {
  const { categories, submitForm } = props;
  return (
    <form onSubmit={submitForm}>
      <div className="field">
        <input type="text" name="name" placeholder="Ingrese el nombre del objeto" className="float-r" />
      </div>
      <div>
        <select name="categoryId" id="categoryId" className="float-r" defaultValue="">
          <option value="" disabled>Selecciones una categoria</option>
          {categories.map((category) => (
            <option
              key={category.id}
              value={category.attributes.id}
            >
              {category.attributes.name}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <input type="textarea" name="description" placeholder="Ingrese una descripción" className="float-r" />
      </div>
      <div className="field">
        <input type="submit" name="create" value="Crear" />
      </div>
    </form>
  );
}

export default ObjectForm;
