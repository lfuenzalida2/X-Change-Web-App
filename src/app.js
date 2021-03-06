const path = require('path');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaLogger = require('koa-logger');
const koaFlashMessage = require('koa-flash-message').default;
const koaStatic = require('koa-static');
const render = require('koa-ejs');
const session = require('koa-session');
const override = require('koa-override-method');
const jsonApiSerializer = require('jsonapi-serializer');
const http = require('http');
const socketIO = require('socket.io');
const assets = require('./assets');
const mailer = require('./mailers');
const routes = require('./routes');
const orm = require('./models');


// App constructor
const app = new Koa();

const developmentMode = app.env === 'development';

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  'saying he is logged in when it\'s really not',
];

// expose ORM through context's prototype
app.context.orm = orm;

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env;
  return next();
});

// json serializer
app.context.jsonSerializer = function jsonSerializer(type, options) {
  return new jsonApiSerializer.Serializer(type, options);
};

// log requests
app.use(koaLogger());

// webpack middleware for dev mode only
if (developmentMode) {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const koaWebpack = require('koa-webpack');
  koaWebpack()
    .then((middleware) => app.use(middleware))
    .catch(console.error); // eslint-disable-line no-console
}

app.use(koaStatic(path.join(__dirname, '..', 'build'), {}));

// expose a session hash to store information across requests from same client
app.use(session({
  maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
}, app));

// flash messages support
app.use(koaFlashMessage);

// parse request body
app.use(koaBody({
  multipart: true,
  keepExtensions: true,
}));

app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body.fields || ctx.request.body);
  return next();
});

// Configure EJS views
app.use(assets(developmentMode));
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'html.ejs',
  cache: !developmentMode,
});

mailer(app);

// Routing middleware
app.use(routes.routes());

app.server = http.createServer(app.callback());
app.io = socketIO(app.server);

// Patch `app.listen()` to call `app.server.listen()`
app.listen = (...args) => {
  app.server.listen.call(app.server, ...args);
  return app.server;
};

app.io.use((socket, next) => {
  let error = null;
  try {
    // create a new (fake) Koa context to decrypt the session cookie
    const ctx = app.createContext(socket.request, new http.OutgoingMessage());
    socket.session = ctx.session;
  } catch (err) {
    error = err;
  }
  return next(error);
});


app.io.on('connection', async (socket) => {
  socket.auth = false;
  // check the auth data sent by the client
  const { sessionToken } = socket.session;
  let currentSession;
  if (sessionToken) {
    currentSession = await app.context.orm.session.findOne(
      { where: { token: sessionToken } },
    );
  }
  if (currentSession) {
    socket.auth = true;
    socket.join(`userRoom-${currentSession.userId}`);
  }
  if (!socket.auth) {
    socket.disconnect('unauthorized');
  }
  socket.on('join negotiation', (data) => {
    socket.join(`negotiationRoom-${data.negotiationId}`);
  });
  socket.on('add object', (data) => {
    app.io.to(`negotiationRoom-${data}`).emit('add object');
  });
  socket.on('remove object', (data) => {
    app.io.to(`negotiationRoom-${data}`).emit('remove object');
  });
  socket.on('chat message', (data) => {
    app.io.to(`negotiationRoom-${data.negotiationId}`).emit('chat message');
  });
  socket.on('notification', (data) => {
    app.io.to(`userRoom-${data}`).emit('notification');
  });
});

module.exports = app;
