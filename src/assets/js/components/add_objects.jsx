/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';

const axios = require('axios');

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
      // eslint-disable-next-line react/prop-types
      url: props.url,
      socket: io(),
    };
    console.log(this.state.url);
    this.añadirObjeto = this.añadirObjeto.bind(this);
    this.quitarObjeto = this.quitarObjeto.bind(this);
    this.actualObjects = this.ActualObjects.bind(this);
    this.myObjects = this.myObjects.bind(this);
    this.otherObjects = this.otherObjects.bind(this);
  }

  async componentDidMount() {
    // API calls to get my objects and the other's object
    await this.myObjects();
    await this.otherObjects();

    // object socket connection
    this.state.socket.emit('join negotiation', { negotiationId: this.state.id });
    this.state.socket.on('add object', await this.otherObjects);
    this.state.socket.on('remove object', await this.otherObjects);

    // negotiation info, only request
    await axios({
      method: 'get',
      url: `${ur}api/negotiation/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ negotiation: res.data.data, loading: false });
      }, (err) => {
        console.log(err);
      });
  }

  async myObjects() {
    await axios({
      method: 'get',
      url: `${this.state.url}/api/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ data: res.data.data });
      }, (err) => {
        console.log(err);
      });
  }

  async otherObjects() {
    await axios({
      method: 'get',
      url: `${this.state.url}/api/other/${this.state.id}`,
    })
      .then(async (res) => {
        this.setState({ other_data: res.data.data });
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
        } else if (negotiation.attributes.state === 'Cancelled' || negotiation.attributes.state === 'Accepted') {
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
    const url = `${this.state.url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, add: 'Añadir' };
    await axios.post(url, body)
      .then(async (res) => {
        this.setState({ data: res.data.data });
      })
      .then(async (res) => {
        this.state.socket.emit('add object', negotiationId);
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
    const url = `${this.state.url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, _method: 'delete' };
    await axios.post(url, body)
      .then((res) => {
        this.setState({ data: res.data.data });
      })
      .then(async (res) => {
        this.state.socket.emit('remove object', negotiationId);
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
                </tr>
              </thead>
              <tbody>
                { data.map((element) => (
                  element.attributes.negotiations.map((object) => (
                    // eslint-disable-next-line radix
                    negotiation.attributes.state !== 'Cancelled' && object.objectNegotiation.negotiationId === parseInt(negotiation.id) && (
                    <tr key={element.id}>
                      {(element.attributes.photos[0]
                        ? <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></td>
                        : <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg`} alt="" /></td>
                        )}
                      <td>{element.attributes.name}</td>
                      <td>
                        <form method="DEL" onSubmit={this.quitarObjeto}>
                          <input type="hidden" name="_method" value="delete" />
                          <input type="hidden" name="negotiationId" value={negotiation.id} />
                          <input type="hidden" name="objectId" value={element.id} />
                          <input type="submit" value="Quitar" className="btn float-r" disabled={(negotiation.attributes.state === 'In Progress' ? '' : 'disabled')} />
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
                    negotiation.attributes.state !== 'Cancelled' && object.objectNegotiation.negotiationId === parseInt(negotiation.id) && (
                    <tr key={element.id}>
                      {(element.attributes.photos[0]
                        ? <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></td>
                        : <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg`} alt="" /></td>
                       )}
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
                    {(element.attributes.photos[0]
                      ? <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></td>
                      : <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg`} alt="" /></td>
                    )}
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
                    {(element.attributes.photos[0]
                      ? <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></td>
                      : <td><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg`} alt="" /></td>
                    )}
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
