/* eslint-disable no-param-reassign */
/* eslint-disable no-shadow */
/* eslint-disable radix */
/* eslint-disable react/sort-comp */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-classes-per-file */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';

const axios = require('axios');

export default class NegotiationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      negotiations: null,
      currentUser: null,
      actualNegotiation: null,
    };
    this.openNegotiation = this.openNegotiation.bind(this);
  }

  async componentDidMount() {
    await axios({
      method: 'get',
      url: `${this.props.url}/api/negotiations/`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ negotiations: data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: `${this.props.url}/api/current_user/`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({
          currentUser: { id: parseInt(data.id), username: data.attributes.username },
          loading: false,
        });
      }, (err) => {
        console.log(err);
      });
  }

  openNegotiation(event) {
    event.preventDefault();
    this.setState({ actualNegotiation: event.target.negotiationId.value });
  }

  render() {
    const {
      loading, negotiations, currentUser, actualNegotiation,
    } = this.state;
    const { url } = this.props;

    if (loading) return <p>Loading...</p>;

    return (
      <div>
        <div>
          <Negotiations negotiationsList={negotiations} currentUser={currentUser} negotiation={actualNegotiation} openNegotiation={this.openNegotiation} />
        </div>
        {actualNegotiation
          ? <Negotiation id={actualNegotiation} url={url} currentUser={currentUser} />
          : <p>Escoge alguna negociacion que quieras abrir</p> }
      </div>
    );
  }
}

class Negotiation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      otherData: null,
      otherUser: null,
      negotiation: null,
      loading: true,
      socket: io(),
    };
    this.añadirObjeto = this.añadirObjeto.bind(this);
    this.quitarObjeto = this.quitarObjeto.bind(this);
    this.ActualObjects = this.ActualObjects.bind(this);
    this.myObjects = this.myObjects.bind(this);
    this.otherObjects = this.otherObjects.bind(this);
    this.whenMounting = this.whenMounting.bind(this);
  }

  async componentDidMount() {
    await this.whenMounting();
  }

  async componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      await this.whenMounting();
    }
  }

  async whenMounting() {
    // API calls to get my objects, the other's object and messagges
    await this.myObjects();
    await this.otherObjects();

    // object socket connection
    this.state.socket.emit('join negotiation', { negotiationId: this.props.id });
    this.state.socket.on('add object', this.otherObjects);
    this.state.socket.on('remove object', this.otherObjects);

    // negotiation info, only request
    await axios({
      method: 'get',
      url: `${this.props.url}/api/negotiation/${this.props.id}`,
    })
      .then(async (res) => {
        this.setState({ negotiation: res.data.data });
      }, (err) => {
        console.log(err);
      })
      .then(() => {
        // Get otherUser of the negotiation
        if (this.state.negotiation) {
          if (this.props.currentUser.id === this.state.negotiation.attributes['seller-id']) {
            this.setState({ otherUser: this.state.negotiation.attributes['customer-id'], loading: false });
          } else {
            this.setState({ otherUser: this.state.negotiation.attributes['seller-id'], loading: false });
          }
        }
      }, (err) => {
        console.log(err);
      });
  }

  async myObjects() {
    await axios({
      method: 'get',
      url: `${this.props.url}/api/${this.props.id}`,
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
      url: `${this.props.url}/api/other/${this.props.id}`,
    })
      .then(async (res) => {
        this.setState({ otherData: res.data.data });
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

  async añadirObjeto(event) {
    event.preventDefault();
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const url = `${this.props.url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, add: 'Añadir' };
    await axios.post(url, body)
      .then(async (res) => {
        this.setState({ data: res.data.data });
      })
      .then(async () => {
        this.state.socket.emit('add object', negotiationId);
      })
      .catch((err) => {
        console.log(err);
      });
  }


  async quitarObjeto(event) {
    event.preventDefault();
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const url = `${this.props.url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, _method: 'delete' };
    await axios.post(url, body)
      .then((res) => {
        this.setState({ data: res.data.data });
      })
      .then(async () => {
        this.state.socket.emit('remove object', negotiationId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      loading, data, otherData, otherUser, negotiation, socket,
    } = this.state;

    if (loading) return <p>Loading...</p>;
    return (
      <div>
        <div>
          <Messages url={this.props.url} socket={socket} negotiation={negotiation} currentUser={this.props.currentUser} otherUser={otherUser} owner={negotiation.attributes['seller-id']} />
        </div>
        <h2 className="center">Lista de Objetos</h2>
        <div className="neg_layout">
          <AvailableObjectList data={data} negotiation={negotiation} quitarObjeto={this.quitarObjeto} />
          <AvailableObjectList data={otherData} negotiation={negotiation} />
        </div>
        <br />
        <div className="neg_layout">
          <TradingObjectList data={data} negotiation={negotiation} ActualObjects={this.ActualObjects} añadirObjeto={this.añadirObjeto} />
          <TradingObjectList data={otherData} negotiation={negotiation} ActualObjects={this.ActualObjects} />
        </div>
      </div>
    );
  }
}

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      messages: null,
    };
    // This lets us refer to a Html element
    this.send = React.createRef();
    this.messagesRef = React.createRef();
    this.sendMessage = this.sendMessage.bind(this);
    this.onKeyEnter = this.onKeyEnter.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.scrollBottom = this.scrollBottom.bind(this);
  }

  async componentDidMount() {
    // object socket connection
    this.props.socket.on('chat message', async () => {
      await this.getMessages();
      this.scrollBottom();
    });

    // get Messages
    await this.getMessages();
    this.setState({ loading: false });
    this.scrollBottom();
  }

  scrollBottom() {
    this.messagesRef.current.scrollTo({ top: 9999999999999999 });
  }

  async getMessages() {
    // Obtain messages
    await axios({
      method: 'get',
      url: `${this.props.url}/api/messagges/${this.props.negotiation.id}`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ messages: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async onKeyEnter(event) {
    if (event.keyCode === 13) {
      this.send.current.click();
    }
  }

  async sendMessage(event) {
    event.preventDefault();
    const url = `${this.props.url}/messages/`;
    const senderId = this.props.currentUser.id;
    const negotiationId = this.props.negotiation.id;
    const receiverId = this.props.otherUser;
    const text = event.target.m.value;
    const body = {
      negotiationId, senderId, receiverId, text,
    };
    event.target.m.value = '';
    await axios.post(url, body)
      .then(async () => {
        this.props.socket.emit('chat message', { negotiationId });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const { loading, messages } = this.state;
    const { currentUser, negotiation } = this.props;

    if (loading) return <p>Loading Messages...</p>;

    return (
      <div id="chat">
        <div id="messages" ref={this.messagesRef}>
          { messages.map((message) => (
            <div key={message.id}>
              { (message.attributes['sender-id'] === currentUser.id)
                ? (
                  <div className="wrapper-me">
                    <div className="me">
                      {message.attributes.text}
                      <div className="time">{message.attributes['created-at'].toLocaleString('es-CL', { hour12: false }).slice('11', '16')}</div>
                    </div>
                  </div>
                )
                : (
                  <div className="other">
                    {message.attributes.text}
                    <div className="time">{message.attributes['created-at'].toLocaleString('es-CL', { hour12: false }).slice('11', '16')}</div>
                  </div>
                )}
            </div>
          ))}
        </div>

        <div id="send">
          <form id="send-message" onSubmit={this.sendMessage} method="POST">
            <div className="wrapper-textarea"><textarea name="text" id="m" type="text" onKeyDown={this.onKeyEnter} /></div>
            <input ref={this.send} type="submit" id="send-btn" values="Enviar" className="btn" disabled={negotiation.attributes.state === 'Cancelled' ? 'disabled' : ''} />
          </form>
        </div>
      </div>
    );
  }
}

class Negotiations extends Component {
  render() {
    const { negotiationsList, currentUser, openNegotiation } = this.props;
    return (
      <div className="fixed-width float-l" id="negotiations-list">
        <h2>Mis Negociaciones</h2>
        { !negotiationsList.length
          ? <p>No tienes niguna negociacion</p>
          : (
            <table className="form">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Estado</th>
                  <th>Ver</th>
                </tr>
              </thead>
              <tbody>
                { negotiationsList.map((negotiation) => (
                  <tr key={negotiation.id}>
                    { negotiation.attributes.customer.id !== currentUser.id
                      ? <td>{negotiation.attributes.customer.username}</td>
                      : <td>{negotiation.attributes.seller.username}</td> }
                    <td>{negotiation.attributes.state === 'Accepted' ? 'Aceptada' : negotiation.attributes.state === 'Cancelled' ? 'Cancelada' : 'En Progreso'}</td>
                    <td>
                      <form onSubmit={openNegotiation}>
                        <input type="hidden" name="negotiationId" value={negotiation.id} />
                        <input type="submit" value="Ver" className="btn" />
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    );
  }
}

class AvailableObjectList extends Component {
  render() {
    const { data, negotiation, quitarObjeto } = this.props;
    return (
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
                    : <td><img className="negotiation-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg" alt="" /></td>
                    )}
                  <td>{element.attributes.name}</td>
                  {quitarObjeto && (
                    <td>
                      <form method="DEL" onSubmit={quitarObjeto}>
                        <input type="hidden" name="_method" value="delete" />
                        <input type="hidden" name="negotiationId" value={negotiation.id} />
                        <input type="hidden" name="objectId" value={element.id} />
                        <input type="submit" value="Quitar" className="btn float-r" disabled={(negotiation.attributes.state === 'In Progress' ? '' : 'disabled')} />
                      </form>
                    </td>
                  )}
                </tr>
                )
              ))
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}


class TradingObjectList extends Component {
  render() {
    const {
      data, negotiation, ActualObjects, añadirObjeto,
    } = this.props;
    return (
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
                  : <td><img className="negotiation-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg" alt="" /></td>
                )}
                <td>{element.attributes.name}</td>
                <td>{element.attributes.category.name}</td>
                {añadirObjeto && (
                <td>
                  <form method="POST" onSubmit={añadirObjeto}>
                    <input type="hidden" name="negotiationId" value={negotiation.id} />
                    <input type="hidden" name="objectId" value={element.id} />
                    <ActualButton disabled={ActualObjects(element.id)} />
                  </form>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

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