const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function envoyerEmail({ to, subject, html }) {
  return resend.emails.send({
    from: 'PASTEF Pologne <onboarding@resend.dev>',
    to,
    subject,
    html,
  });
}

module.exports = envoyerEmail;