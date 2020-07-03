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
      url: `${url}/xchange/negotiations/`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({ negotiations: data });
      }, (err) => {
        console.log(err);
      });

    await axios({
      method: 'get',
      url: `${url}/xchange/current_user/`,
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
    this.setState({ actualNegotiation: event.target.attributes.value.value });
  }

  render() {
    const {
      loading, negotiations, currentUser, actualNegotiation,
    } = this.state;
    const { url } = this.props;

    if (loading) return <p>Loading...</p>;

    return (
      <>
        <>
          <Negotiations
            key={negotiations}
            negotiationsList={negotiations}
            currentUser={currentUser}
            actualNegotiation={actualNegotiation}
            openNegotiation={this.openNegotiation}
          />
        </>
        {actualNegotiation
          ? (
            <Negotiation
              id={actualNegotiation}
              url={url}
              currentUser={currentUser}
              stateChange={this.stateChange}
            />
          )
          : (
            <div className="negotiation-alternative center">
              <h3 className="text-style">Centro de negociaciones</h3>
              <p>Haz click en una negociación para desplegar su información</p>
              <p>
                Los tres estados posibles de una negociación son:
              </p>
              <div className="state-dots">
                <div>
                  <div className="dot-display">
                    <span className="state-dot green" />
                    <span>: Aceptada</span>
                  </div>
                  <div className="dot-display">
                    <span className="state-dot yellow" />
                    <span>: En Progreso</span>
                  </div>
                  <div className="dot-display">
                    <span className="state-dot red" />
                    <span>: Cancelada</span>
                  </div>
                </div>
              </div>
              <p className="text-style">
                Para ofertar un objeto en la negociación haz click sobre su imagen
              </p>
            </div>
          )}
      </>
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
    <div className="fixed-width-negotiation">
      <h2>Mis Negociaciones</h2>
      { !negotiationsList.length
        ? <p>No tienes niguna negociacion</p>
        : (
          <div className="form scrollable">
            <div className="bottom">
              <span className="text-style">Usuario</span>
            </div>
            <div>
              { negotiationsList.map((negotiation) => (
                <div key={negotiation.id} className={`${actualNegotiation === negotiation.id ? 'actual' : ''} negotiation row`}>
                  <div className="top" onClick={openNegotiation} value={negotiation.id} />
                  <div className="bottom">
                    <div className="dot-display">
                      <span className={`state-dot float-r
                      ${negotiation.attributes.state === 'Accepted'
                        ? 'green'
                        : negotiation.attributes.state === 'Cancelled'
                          ? 'red'
                          : 'yellow'}`}
                      />
                      { negotiation.attributes.customer.id !== currentUser.id
                        ? <span>{negotiation.attributes.customer.username}</span>
                        : <span>{negotiation.attributes.seller.username}</span> }
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
      url: `${url}/xchange/review/${id}/${currentUser.id}/${otherUser}`,
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
      url: `${url}/xchange/messagges/${id}`,
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
      url: `${url}/xchange/negotiation/${id}`,
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
      url: `${url}/xchange/${id}`,
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
      url: `${url}/xchange/other/${id}`,
    })
      .then(async (res) => {
        this.setState({ otherData: res.data.data });
      }, (err) => {
        console.log(err);
      });
  }

  async whenMounting() {
    // xchange calls to get my objects, the other's object, negotiations info and messagges
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
        await stateChange();
        // this.setState({ data: res.data.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  actualObjects(data, id) {
    let value = true;
    const { negotiation } = this.state;
    data.map((element) => {
      element.attributes.negotiations.map((negotiationObjects) => {
        if ((negotiation.id === negotiationObjects.id.toString()
        || element.attributes.state === false) && id === element.id) {
          value = false;
        }
      });
    });
    return value;
  }

  async añadirObjeto(event) {
    event.preventDefault();
    const { url } = this.props;
    const { socket } = this.state;
    const negotiationId = event.target.childNodes[0].value;
    const objectId = event.target.childNodes[1].value;
    const ur = `${url}/xchange/${negotiationId}/object`;
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
    const negotiationId = event.target.childNodes[0].value;
    const objectId = event.target.childNodes[1].value;
    const ur = `${url}/xchange/${negotiationId}/object`;
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
      <div className="negotiation_layout">
        <h3>
          Negociación con {otherName}
        </h3>
        <>
          <Submit
            key={review}
            submitNegotiation={this.submitNegotiation}
            submitReview={this.submitReview}
            negotiation={negotiation}
            currentUser={currentUser}
            review={review}
          />
        </>
        <>
          <Messages
            key={messages}
            url={url}
            socket={socket}
            negotiation={negotiation}
            currentUser={currentUser}
            otherUser={otherUser}
            owner={negotiation.attributes['seller-id']}
          />
        </>
        <h2 className="center">Lista de Objetos</h2>
        <div className="neg_layout">
          <div className="full-width">
            <h3>Mi oferta</h3>
            <AvailableObjectList
              data={data}
              negotiation={negotiation}
              quitarObjeto={this.quitarObjeto}
            />
          </div>
          <div className="full-width">
            <h3 className="triple_dot">Oferta de {otherName}</h3>
            <AvailableObjectList
              data={otherData}
              negotiation={negotiation}
            />
          </div>
        </div>
        <div className="neg_layout">
          <div className="full-width">
            <h3>Mi Inventario</h3>
            <TradingObjectList
              data={data}
              negotiation={negotiation}
              actualObjects={this.actualObjects}
              añadirObjeto={this.añadirObjeto}
            />
          </div>
          <div className="full-width">
            <h3 className="triple_dot">Inventario de {otherName}</h3>
            <TradingObjectList
              data={otherData}
              negotiation={negotiation}
              actualObjects={this.actualObjects}
            />
          </div>
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
      other: null,
      loading: true,
    };
    this.openReviewSubmit = this.openReviewSubmit.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    const { negotiation, currentUser } = this.props;
    if (negotiation.attributes['customer-id'] === currentUser.id) {
      this.setState({ other: 'Seller' });
    } else if (negotiation.attributes['seller-id'] === currentUser.id) {
      this.setState({ other: 'Customer' });
    }
    this.setState({ loading: false });
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

    const { reviewForm, other, loading } = this.state;

    if (loading) return <p />;

    // Aqui se ponen las estrellas
    if (reviewForm) {
      return (
        <div className={reviewForm ? ('modal') : ('hidden')}>
          <div className="modal-content">
            <div className="close">
              <span onClick={this.openReviewSubmit}>✖</span>
            </div>
            <form className="modal-form" onSubmit={submitReview} method="POST">
              <h2 className="modal-title center">Nueva review</h2>
              <div className="ratings form-ratings ">
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
              <div className="field center">
                <input className="input-register" type="text" name="text" placeholder="Añade un comentario..." />
              </div>
              <div className="field center">
                <input type="submit" value="Enviar la Valoración" className="btn" />
              </div>
            </form>
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
      <div className="submit-container">
        <input type="hidden" id="currentUser" value={currentUser.id} />
        { (negotiation.attributes.state === 'In Progress') ? (
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
        ) : (negotiation.attributes.state === other ? (
          <>
            <span>La otra persona esta esperando a que aceptes</span>
            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="Accepted" />
              <input type="submit" value="Aceptar Oferta" className="btn" />
            </form>

            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="In Progress" />
              <input type="submit" value="Quiero hacer cambios" className="btn" />
            </form>
          </>
        ) : (negotiation.attributes.state === 'Accepted' ? (
          <>
            <div className="form">
              <span>Felicidades, han podido realizar un X-Change exitoso!</span>
            </div>
          </>
        ) : (negotiation.attributes.state === 'Cancelled' ? (
          <div className="form">
            <span>Es una pena que no haya funcionado el X-Change ;(</span>
          </div>
        ) : (negotiation.attributes.state !== 'In Progress'
        && negotiation.attributes.state !== 'Cancelled'
        && negotiation.attributes.state !== 'Accepted' && (
          <div className="form">
            <span>Ahora debes esperar a que acepte la negociación</span>
            <form onSubmit={submitNegotiation} method="POST">
              <input type="hidden" name="state" value="In Progress" />
              <input type="submit" value="No estoy Listo" className="btn" />
            </form>
          </div>
        ))))
        )}
        { review ? (
          <div className="form" id="review">
            <h3>Tu review</h3>
            <div className="ratings">
              { activeStars.map(() => (
                <span className="star active-star">★</span>
              ))}
              { stars.map(() => (
                <span className="star">★</span>
              ))}
            </div>
            <label htmlFor="text" className="text-style">Texto:</label>
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
      sourceLanguage: 'es',
      targetLanguage: 'es',
      translate: false,
    };
    // This lets us refer to a Html element
    this.send = React.createRef();
    this.messagesRef = React.createRef();
    this.sendMessage = this.sendMessage.bind(this);
    this.onKeyEnter = this.onKeyEnter.bind(this);
    this.getMessages = this.getMessages.bind(this);
    this.whenMounting = this.whenMounting.bind(this);
    this.scrollBottom = this.scrollBottom.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeTarget = this.handleChangeTarget.bind(this);
    this.translateMessage = this.translateMessage.bind(this);
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
      event.preventDefault();
      this.send.current.click();
    }
  }

  async getMessages() {
    const { url, negotiation } = this.props;
    const { translate } = this.state;
    // Obtain messages
    await axios({
      method: 'get',
      url: `${url}/xchange/messagges/${negotiation.id}`,
    })
      .then(async (res) => {
        const { data } = res.data;
        this.setState({
          messages: data,
        });
        if (translate) {
          await this.translateMessage();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChangeTarget(event) {
    this.setState({
      targetLanguage: event.target.value,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const { targetLanguage, sourceLanguage } = this.state;
    if (sourceLanguage !== targetLanguage) {
      await this.translateMessage().then(() => {
        this.setState({
          sourceLanguage: targetLanguage,
          translate: true,
        });
      });
    }
  }

  async translateMessage() {
    let { url } = this.props;
    const { messages, targetLanguage } = this.state;
    url = `${url}/xchange/translate`;
    const data = {
      messages,
      targetLanguage,
    };
    await axios.post(url, data)
      .then((res) => {
        this.setState({
          messages: res.data,
        });
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
    const { sourceLanguage } = this.state;
    const ur = `${url}/messages/`;
    const senderId = currentUser.id;
    const negotiationId = negotiation.id;
    const receiverId = otherUser;
    const text = event.target.m.value;
    const language = sourceLanguage;
    const body = {
      negotiationId, senderId, receiverId, text, language,
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
    const { loading, messages, targetLanguage } = this.state;
    const { currentUser, negotiation } = this.props;

    if (loading) return <p>Cargando Mensajes...</p>;

    return (
      <div id="chat">
        <form onSubmit={this.handleSubmit}>
          <div className="traductor">
            <input type="submit" value="Traducir al" id="translate-btn" className="btn" />
            <select value={targetLanguage} onChange={this.handleChangeTarget} className="dropdown translate-language">
              <option value="es">Español</option>
              <option value="en">Inglés</option>
              <option value="de">Alemán</option>
              <option value="fr">Francés</option>
              <option value="it">Italiano</option>
              <option value="pt">Portugués</option>
            </select>
            <hr />
          </div>
        </form>
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
      <div>
        <div>
          { data.map((element) => (
            element.attributes.negotiations.map((object) => (
              negotiation.attributes.state !== 'Cancelled'
              && object.objectNegotiation.negotiationId === parseInt(negotiation.id, 10)
              && (
                <div key={element.id} className="trading-object-row">
                  {negotiation.attributes.state === 'In Progress' && (
                    <div className="top" onClick={quitarObjeto}>
                      <input type="hidden" name="negotiationId" value={negotiation.id} />
                      <input type="hidden" name="objectId" value={element.id} />
                    </div>
                  )}
                  <div className="bottom negotiation-object-display">
                    {(element.attributes.photos[0]
                      ? <span><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></span>
                      : <span><img className="negotiation-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg" alt="" /></span>
                      )}
                    <div className="negotiation-object">
                      <span className="negotiation-object-name">{element.attributes.name}</span>
                      <span className="negotiation-object-category">{element.attributes.category.name}</span>
                    </div>
                  </div>
                </div>
              )
            ))
          ))}
        </div>
      </div>
    </div>
  );
}

function TradingObjectList(props) {
  const {
    data, negotiation, actualObjects, añadirObjeto,
  } = props;
  return (
    <div className="neg_obj_list form">
      <div>
        { data.map((element) => (
          <>
            {actualObjects(data, element.id)
            && element.attributes.state !== false
            && (
            <div key={element.id} className="trading-object-row">
              {negotiation.attributes.state === 'In Progress' && (
                <div className="top" onClick={añadirObjeto}>
                  <input type="hidden" name="negotiationId" value={negotiation.id} />
                  <input type="hidden" name="objectId" value={element.id} />
                </div>
              )}
              <div className="bottom negotiation-object-display">
                {(element.attributes.photos[0]
                  ? <span><img className="negotiation-images" src={`https://xchangestorage.s3.us-east-2.amazonaws.com/${element.attributes.photos[0].fileName}`} alt="" /></span>
                  : <span><img className="negotiation-images" src="https://xchangestorage.s3.us-east-2.amazonaws.com/no_disponible.jpg" alt="" /></span>
                )}
                <div className="negotiation-object">
                  <span className="negotiation-object-name">{element.attributes.name}</span>
                  <span className="negotiation-object-category">{element.attributes.category.name}</span>
                </div>
              </div>
            </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default NegotiationsList;
