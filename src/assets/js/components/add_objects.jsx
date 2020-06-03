/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';

const axios = require('axios');


export default class addObject extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      negotiation: null,
      loading: true,
      id: props.id,
    };
  }

  async componentDidMount() {
    await axios({
      method: 'get',
      url: 'http://localhost:3000/api/'+ this.state.id,
    })
      .then(async (res) => {
        this.setState({ data: res.data.data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: 'http://localhost:3000/api/negotiation/' + this.state.id,
    })
      .then(async (res) => {
        this.setState({ negotiation: res.data.data });
        this.setState({ loading: false });
      }, (err) => {
        console.log(err);
      });

  }

  // eslint-disable-next-line class-methods-use-this
  async añadirObjeto(event) {
    event.preventDefault();
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const url = 'http://localhost:3000/api/' + negotiationId + '/object';
    const body = { negotiationId, objectId, add: 'Añadir' };
    await axios.post(url, body)
      .then((res) => {
        console.log(res);
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
    const url = 'http://localhost:3000/api/' + negotiationId + '/object';
    const body = { negotiationId, objectId, _method: 'delete' };
    await axios.post(url, body)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { loading, data, negotiation } = this.state;
    if (loading) return <p>Loading...</p>;

    console.log(data);
    console.log(negotiation);
    return (
      <div>
        <h2>Lista de Objetos</h2>
        <div className="form">
          <table>
            <thead>
              <tr>
                <th>N</th>
                <th>Nombre</th>
                { negotiation.attributes.state === 'In Progress' && (
                  <th>Quitar</th>
                )}
              </tr>
            </thead>
            <tbody>
              { data.map((element) => (
                element.attributes.negotiations.map((object) => (
                  negotiation.attributes.state === 'In Progress' && object.objectNegotiation.negotiationId === parseInt(negotiation.id) && (
                  <tr key={element.id}>
                    <td>{element.id}</td>
                    <td>{element.attributes.name}</td>
                    <td>
                      <form method="DEL" onSubmit={this.quitarObjeto}>
                        <input type="hidden" name="_method" value="delete" />
                        <input type="hidden" name="negotiationId" value={negotiation.id} />
                        <input type="hidden" name="objectId" value={element.id} />
                        <input type="submit" value="Quitar" className="btn" />
                      </form>
                    </td>
                  </tr>
                  )
                ))
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <table className="form">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Categoria</th>
                <th>Descripción</th>
                <th>Añadir a la Negociación</th>
              </tr>
            </thead>
            <tbody>
              { data.map((element) => (
                <tr key={element.id}>
                  <td>{element.attributes.name}</td>
                  <td>{element.attributes.state.toString()}</td>
                  <td>{element.attributes.category.name}</td>
                  <td>{element.attributes.description}</td>
                  <td>
                    <form method="POST" onSubmit={this.añadirObjeto}>
                      <input type="hidden" name="negotiationId" value={negotiation.id} />
                      <input type="hidden" name="objectId" value={element.id} />
                      <input type="submit" name="add" value="Añadir" className="btn" />
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
