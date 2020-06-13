/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';

const axios = require('axios');

// const ur = 'https://notxchange.herokuapp.com/';
const ur = 'http://localhost:3000/';

// eslint-disable-next-line react/prefer-stateless-function
class ActualButton extends Component {
  // eslint-disable-next-line react/require-render-return
  render() {
    // eslint-disable-next-line react/prop-types
    const { disabled } = this.props;
    return (
      <input type="submit" name="add" value="Añadir" className="btn float-r" disabled={disabled} />
    );
  }
}

export default class addObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      other_data: null,
      negotiation: null,
      loading: true,
      // eslint-disable-next-line react/prop-types
      id: props.id,
    };
    this.añadirObjeto = this.añadirObjeto.bind(this);
    this.quitarObjeto = this.quitarObjeto.bind(this);
    this.actualObjects = this.ActualObjects.bind(this);
  }

  async componentDidMount() {
    await axios({
      method: 'get',
      url: `${ur}api/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ data: res.data.data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: `${ur}api/other/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ other_data: res.data.data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: `${ur}api/negotiation/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ negotiation: res.data.data });
        this.setState({ loading: false });
      }, (err) => {
        console.log(err);
      });
  }

  ActualObjects(id) {
    // eslint-disable-next-line no-var
    var value = '';
    const { data, negotiation } = this.state;
    // eslint-disable-next-line array-callback-return
    data.map((element) => {
      // eslint-disable-next-line consistent-return
      // eslint-disable-next-line array-callback-return
      element.attributes.negotiations.map((negotiationObjects) => {
        // eslint-disable-next-line max-len
        if ((negotiation.id === negotiationObjects.id.toString() || element.attributes.state === false) && id === element.id) {
          value = 'disabled';
        }
      });
    });
    return value;
  }

  // eslint-disable-next-line class-methods-use-this
  async añadirObjeto(event) {
    event.preventDefault();
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const url = `${ur}api/${negotiationId}/object`;
    const body = { negotiationId, objectId, add: 'Añadir' };
    await axios.post(url, body)
      .then(async (res) => {
        this.setState({ data: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }


  // eslint-disable-next-line class-methods-use-this
  async quitarObjeto(event) {
    event.preventDefault();
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const url = `${ur}api/${negotiationId}/object`;
    const body = { negotiationId, objectId, _method: 'delete' };
    await axios.post(url, body)
      .then((res) => {
        this.setState({ data: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { loading, data, other_data, negotiation } = this.state;
    if (loading) return <p>Loading...</p>;
    console.log(data);
    return (
      <div>
        <h2 className="center">Lista de Objetos</h2>
        <div className="neg_layout">
          <div className="neg_obj_list form">
            <table>
              <thead className="head">
                <tr>
                  <th>Nombre</th>
                  { negotiation.attributes.state === 'In Progress' && (
                    <th>Quitar</th>
                  )}
                </tr>
              </thead>
              <tbody>
                { data.map((element) => (
                  element.attributes.negotiations.map((object) => (
                    // eslint-disable-next-line radix
                    negotiation.attributes.state === 'In Progress' && object.objectNegotiation.negotiationId === parseInt(negotiation.id) && (
                    <tr key={element.id}>
                      <td>{element.attributes.name}</td>
                      <td>
                        <form method="DEL" onSubmit={this.quitarObjeto}>
                          <input type="hidden" name="_method" value="delete" />
                          <input type="hidden" name="negotiationId" value={negotiation.id} />
                          <input type="hidden" name="objectId" value={element.id} />
                          <input type="submit" value="Quitar" className="btn float-r" />
                        </form>
                      </td>
                    </tr>
                    )
                  ))
                ))}
              </tbody>
            </table>
          </div>
          <div className="neg_obj_list form">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                </tr>
              </thead>
              <tbody>
                { other_data.map((element) => (
                  element.attributes.negotiations.map((object) => (
                    // eslint-disable-next-line radix
                    negotiation.attributes.state === 'In Progress' && object.objectNegotiation.negotiationId === parseInt(negotiation.id) && (
                    <tr key={element.id}>
                      <td>{element.attributes.name}</td>
                    </tr>
                    )
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <br />
        <div className="neg_layout">
          <div className="neg_obj_list">
            <table className="form">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoria</th>
                  <th>Añadir a la Negociación</th>
                </tr>
              </thead>
              <tbody>
                { data.map((element) => (
                  <tr key={element.id}>
                    <td>{element.attributes.name}</td>
                    <td>{element.attributes.category.name}</td>
                    <td>
                      <form method="POST" onSubmit={this.añadirObjeto}>
                        <input type="hidden" name="negotiationId" value={negotiation.id} />
                        <input type="hidden" name="objectId" value={element.id} />
                        <ActualButton disabled={this.ActualObjects(element.id)} />

                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="neg_obj_list">
            <table className="form">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoria</th>
                </tr>
              </thead>
              <tbody>
                { other_data.map((element) => (
                  <tr key={element.id}>
                    <td>{element.attributes.name}</td>
                    <td>{element.attributes.category.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
