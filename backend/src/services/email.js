const nodemailer = require('nodemailer');
const { emailFrom } = require('../config');

const transporter = nodemailer.createTransport({
  // Local SMTP (MailHog) or your own SMTP config.
  // For initial testing, use a stub that logs to console.
  jsonTransport: true
});

async function sendEmail({ to, subject, html }) {
  const mail = { from: emailFrom, to, subject, html };
  try {
    const info = await transporter.sendMail(mail);
    console.log('Email queued:', info);
  } catch (err) {
    console.error('Email error', err);
  }
}

module.exports = { sendEmail };
