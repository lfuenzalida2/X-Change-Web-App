module.exports = function sendRegistrationEmail(ctx, { user }) {
  // you can get all the additional data needed by using the provided one plus ctx
  return ctx.sendMail('registration', { to: user.mail, subject: '¡Bienvenido a X-Change!' }, { user });
};
