module.exports = function sendNegotiationEmail(ctx, { user }) {
  // you can get all the additional data needed by using the provided one plus ctx
  const other = ctx.state.currentUser;
  return ctx.sendMail('new_negotiation', { to: user.mail, subject: '¡Tienes una nueva negociación!' }, { user, other });
};
