import React, { Component } from 'react';
import io from '../../../../node_modules/socket.io-client/dist/socket.io';

const axios = require('axios');

class NegotiationsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      negotiations: null,
      currentUser: null,
      actualNegotiation: this.props.id,
    };
    this.openNegotiation = this.openNegotiation.bind(this);
    this.whenMounting = this.whenMounting.bind(this);
    this.stateChange = this.stateChange.bind(this);
  }

  async componentDidMount() {
    await this.whenMounting();
  }

  async stateChange() {
    await this.whenMounting();
  }

  async whenMounting() {
    const { url } = this.props;
    await axios({
      method: 'get',
      url: `${url}/api/negotiations/`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ negotiations: data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: `${url}/api/current_user/`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({
          currentUser: { id: parseInt(data.id, 10), username: data.attributes.username },
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
          <Negotiations
            key={negotiations}
            negotiationsList={negotiations}
            currentUser={currentUser}
            actualNegotiation={actualNegotiation}
            openNegotiation={this.openNegotiation}
          />
        </div>
        {actualNegotiation
          ? (
            <Negotiation
              id={actualNegotiation}
              url={url}
              currentUser={currentUser}
              stateChange={this.stateChange}
            />
          )
          : <p>Escoge alguna negociacion que quieras abrir</p> }
      </div>
    );
  }
}

function Negotiations(props) {
  const {
    negotiationsList,
    currentUser,
    openNegotiation,
    actualNegotiation,
  } = props;
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
                <tr key={negotiation.id} className={actualNegotiation === negotiation.id ? 'actual' : ''}>
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

class Negotiation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
      otherData: null,
      otherName: null,
      otherUser: null,
      negotiation: null,
      loading: true,
      messages: null,
      review: null,
      socket: io(),
    };

    this.añadirObjeto = this.añadirObjeto.bind(this);
    this.quitarObjeto = this.quitarObjeto.bind(this);
    this.actualObjects = this.actualObjects.bind(this);
    this.getNegotiation = this.getNegotiation.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.getReview = this.getReview.bind(this);
    this.myObjects = this.myObjects.bind(this);
    this.submitReview = this.submitReview.bind(this);
    this.submitNegotiation = this.submitNegotiation.bind(this);
    this.otherObjects = this.otherObjects.bind(this);
    this.whenMounting = this.whenMounting.bind(this);
  }

  async componentDidMount() {
    await this.whenMounting();
  }

  async componentDidUpdate(prevProps) {
    const { id } = this.props;
    if (id !== prevProps.id) {
      await this.whenMounting();
    }
  }

  async getReview() {
    const { id, url, currentUser } = this.props;
    const { otherUser } = this.state;
    // Obtain messages
    await axios({
      method: 'get',
      url: `${url}/api/review/${id}/${currentUser.id}/${otherUser}`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ review: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getMessages() {
    const { id, url } = this.props;
    // Obtain messages
    await axios({
      method: 'get',
      url: `${url}/api/messagges/${id}`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ messages: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getNegotiation() {
    const { id, url } = this.props;
    await axios({
      method: 'get',
      url: `${url}/api/negotiation/${id}`,
    })
      .then(async (res) => {
        this.setState({ otherName: res.data.other });
        this.setState({ negotiation: res.data.data });
      }, (err) => {
        console.log(err);
      });
  }

  async myObjects() {
    const { id, url } = this.props;
    await axios({
      method: 'get',
      url: `${url}/api/${id}`,
    })
      .then(async (res) => {
        this.setState({ data: res.data.data });
      }, (err) => {
        console.log(err);
      });
  }

  async otherObjects() {
    const { id, url } = this.props;
    await axios({
      method: 'get',
      url: `${url}/api/other/${id}`,
    })
      .then(async (res) => {
        this.setState({ otherData: res.data.data });
      }, (err) => {
        console.log(err);
      });
  }

  async whenMounting() {
    // API calls to get my objects, the other's object, negotiations info and messagges
    await this.myObjects();
    await this.otherObjects();
    await this.getNegotiation();
    await this.getMessages();

    const { socket, negotiation } = this.state;
    const { id, currentUser } = this.props;

    // object socket connection
    socket.emit('join negotiation', { negotiationId: id });
    socket.on('add object', this.otherObjects);
    socket.on('remove object', this.otherObjects);

    // Get otherUser of the negotiation
    if (negotiation) {
      if (currentUser.id === negotiation.attributes['seller-id']) {
        this.setState({ otherUser: negotiation.attributes['customer-id'], loading: false });
      } else {
        this.setState({ otherUser: negotiation.attributes['seller-id'], loading: false });
      }
      await this.getReview();
    }
  }

  async submitReview(event) {
    // Submit Review+
    event.preventDefault();
    const { rating, text } = event.target;
    const { otherUser, negotiation } = this.state;
    const { currentUser, url } = this.props;
    const ur = `${url}/reviews/`;
    const body = {
      reviewerId: currentUser.id,
      reviewedId: otherUser,
      negotiationId: negotiation.id,
      rating: rating.value,
      text: text.value,
    };
    await axios.post(ur, body)
      .then(async () => {
        this.getReview();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async submitNegotiation(event) {
    event.preventDefault();
    const { url, stateChange } = this.props;
    const { state } = event.target;
    const { negotiation } = this.state;
    const ur = `${url}/negotiations/${negotiation.id}`;
    const body = { state: state.value };
    await axios.patch(ur, body)
      .then(async () => {
        await this.getNegotiation();
        stateChange();
        // this.setState({ data: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  actualObjects(id) {
    let value = '';
    const { data, negotiation } = this.state;
    data.map((element) => {
      element.attributes.negotiations.map((negotiationObjects) => {
        if ((negotiation.id === negotiationObjects.id.toString()
        || element.attributes.state === false) && id === element.id) {
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
    const { url } = this.props;
    const { socket } = this.state;
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const ur = `${url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, add: 'Añadir' };
    await axios.post(ur, body)
      .then(async (res) => {
        this.setState({ data: res.data.data });
      })
      .then(async () => {
        socket.emit('add object', negotiationId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async quitarObjeto(event) {
    event.preventDefault();
    const { url } = this.props;
    const { socket } = this.state;
    const negotiationId = event.target.negotiationId.value;
    const objectId = event.target.objectId.value;
    const ur = `${url}/api/${negotiationId}/object`;
    const body = { negotiationId, objectId, _method: 'delete' };
    await axios.post(ur, body)
      .then((res) => {
        this.setState({ data: res.data.data });
      })
      .then(async () => {
        socket.emit('remove object', negotiationId);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      loading, data, otherData, otherUser, negotiation, socket, messages, review, otherName,
    } = this.state;

    const { currentUser, url } = this.props;

    if (loading) return <p>Loading...</p>;
    return (
      <div>
        <p>(Si es que no puedes ver los botones de "añadir" o "quitar", haz zoomout en el navegador, esperamos arreglar eso ;) )</p>
        <h3>
          Negociación con {otherName}
        </h3>
        <div>
          <Submit
            key={review}
            submitNegotiation={this.submitNegotiation}
            submitReview={this.submitReview}
            negotiation={negotiation}
            currentUser={currentUser}
            review={review}
          />
        </div>
        <div>
          <Messages
            key={messages}
            url={url}
            socket={socket}
            negotiation={negotiation}
            currentUser={currentUser}
            otherUser={otherUser}
            owner={negotiation.attributes['seller-id']}
          />
        </div>
        <h2 className="center">Lista de Objetos</h2>
        <div className="neg_layout">
          <AvailableObjectList
            data={data}
            negotiation={negotiation}
            quitarObjeto={this.quitarObjeto}
          />
          <AvailableObjectList
            data={otherData}
            negotiation={negotiation}
          />
        </div>
        <br />
        <div className="neg_layout">
          <TradingObjectList
            data={data}
            negotiation={negotiation}
            actualObjects={this.actualObjects}
            añadirObjeto={this.añadirObjeto}
          />
          <TradingObjectList
            data={otherData}
            negotiation={negotiation}
            actualObjects={this.actualObjects}
          />
        </div>
      </div>
    );
  }
}

class Submit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewForm: false,
    };
    this.openReviewSubmit = this.openReviewSubmit.bind(this);
  }

  openReviewSubmit(event) {
    event.preventDefault();
    this.setState((prevState) => ({
      reviewForm: !prevState.reviewForm,
    }));
  }

  render() {
    const {
      negotiation, currentUser, review, submitReview, submitNegotiation,
    } = this.props;

    const { reviewForm } = this.state;

    // Aqui se ponen las estrellas
    if (reviewForm) {
      return (
        <div className={reviewForm ? ('modal') : ('hidden')}>
          <div className="modal-content">
            <span className="close" onClick={this.openReviewSubmit}>Close</span>
            <div className="form">
              <form onSubmit={submitReview} method="POST">
                <div className="ratings form-ratings">
                  <input name="rating" id="e5" type="radio" value="5" />
                  <label htmlFor="e5">★</label>
                  <input name="rating" id="e4" type="radio" value="4" />
                  <label htmlFor="e4">★</label>
                  <input name="rating" id="e3" type="radio" value="3" />
                  <label htmlFor="e3">★</label>
                  <input name="rating" id="e2" type="radio" value="2" />
                  <label htmlFor="e2">★</label>
                  <input name="rating" id="e1" type="radio" value="1" />
                  <label htmlFor="e1">★</label>
                </div>
                <textarea type="text" name="text" placeholder="Añade un comentario..." />
                <input type="submit" value="Enviar la Valoración" className="btn" />
              </form>
            </div>
          </div>
        </div>
      );
    }
    const activeStars = [];
    const stars = [];
    if (review) {
      for (let i = 0; i < review.attributes.rating; i++) {
        activeStars.push('');
      }
      for (let i = 0; i < 5 - review.attributes.rating; i++) {
        stars.push('');
      }
    }
    return (
      <div className="flexbox-container">
        <input type="hidden" id="currentUser" value={currentUser.id} />
        { negotiation.attributes.state === 'In Progress' ? (
          <>
            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="Accepted" />
              <input type="submit" value="Aceptar Oferta" className="btn" />
            </form>

            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="Cancelled" />
              <input type="submit" value="Cancelar Negociación" className="btn" />
            </form>
          </>
        ) : (negotiation.attributes.state === 'Accepted' ? (
          <>
            <div className="form">
              Felicidades, han podido realizar un X-Change exitoso!
            </div>
          </>
        ) : (negotiation.attributes.state === 'Cancelled' ? (
          <div className="form">
            Es una pena que no haya funcionado el X-Change ;(
          </div>
        ) : (negotiation.attributes.state !== 'In Progress' && negotiation.attributes.state !== 'Cancelled' && negotiation.attributes.state !== 'Accepted' && (
          <div className="form">
            Ahora debes esperar a que acepte la negociación
            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="In Progress" />
              <input type="submit" value="No estoy Listo" className="btn" />
            </form>
          </div>
        )))
        )}
        { review ? (
          <div className="border" id="review">
            <h3>Tu review fue</h3>
            <div className="ratings">
              { activeStars.map(() => (
                <span className="star active-star">★</span>
              ))}
              { stars.map(() => (
                <span className="star">★</span>
              ))}
            </div>
            <label htmlFor="rating">Rating:</label>
            <span name="rating">{review.attributes.rating}</span>
            <br />
            <label htmlFor="text">Texto:</label>
            <span name="text">{review.attributes.text}</span>
          </div>
        ) : ((negotiation.attributes.state === 'Accepted' || negotiation.attributes.state === 'Cancelled') && (
          <>
            <form onSubmit={this.openReviewSubmit} method="POST">
              <input type="submit" value="Hacer una Review" className="btn" />
            </form>
          </>
        )
        )}
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
    this.whenMounting = this.whenMounting.bind(this);
    this.scrollBottom = this.scrollBottom.bind(this);
  }

  async componentDidMount() {
    const { socket } = this.props;
    // object socket connection
    socket.on('chat message', async () => {
      await this.getMessages();
      this.scrollBottom();
    });
    await this.whenMounting();
  }

  async onKeyEnter(event) {
    if (event.keyCode === 13) {
      this.send.current.click();
    }
  }

  async getMessages() {
    const { url, negotiation } = this.props;
    // Obtain messages
    await axios({
      method: 'get',
      url: `${url}/api/messagges/${negotiation.id}`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ messages: data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  scrollBottom() {
    this.messagesRef.current.scrollTo({ top: 9999999999999999 });
  }

  async whenMounting() {
    // get Messages
    await this.getMessages();
    this.setState({ loading: false });
    this.scrollBottom();
  }

  async sendMessage(event) {
    event.preventDefault();
    const {
      url,
      currentUser,
      negotiation,
      otherUser,
      socket,
    } = this.props;
    const ur = `${url}/messages/`;
    const senderId = currentUser.id;
    const negotiationId = negotiation.id;
    const receiverId = otherUser;
    const text = event.target.m.value;
    const body = {
      negotiationId, senderId, receiverId, text,
    };
    event.target.m.value = '';
    await axios.post(ur, body)
      .then(async () => {
        socket.emit('chat message', { negotiationId });
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
            <input ref={this.send} type="submit" id="send-btn" value="Enviar" className="btn" disabled={negotiation.attributes.state === 'Cancelled' ? 'disabled' : ''} />
          </form>
        </div>
      </div>
    );
  }
}

function AvailableObjectList(props) {
  const { data, negotiation, quitarObjeto } = props;
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

function TradingObjectList(props) {
  const {
    data, negotiation, actualObjects, añadirObjeto,
  } = props;
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
              {añadirObjeto && element.state !== false && (
              <td>
                <form method="POST" onSubmit={añadirObjeto}>
                  <input type="hidden" name="negotiationId" value={negotiation.id} />
                  <input type="hidden" name="objectId" value={element.id} />
                  <ActualButton disabled={actualObjects(element.id)} />
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

function ActualButton(props) {
  const { disabled } = props;
  return (
    <input type="submit" name="add" value="Añadir" className="btn float-r" disabled={disabled} />
  );
}

export default NegotiationsList;
