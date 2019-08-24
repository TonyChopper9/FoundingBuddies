const functions = require('firebase-functions');
const nodemailer = require('nodemailer');
// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable these:
// 1. https://www.google.com/settings/security/lesssecureapps
// 2. https://accounts.google.com/DisplayUnlockCaptcha
// For other types of transports such as Sendgrid see https://nodemailer.com/transports/
// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
//const gmailEmail = functions.config().gmail.email;
//const gmailPassword = functions.config().gmail.password;
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "foundingbuddies@gmail.com",
    pass: "BingPot!99",
  },
});

const APP_NAME = 'FB GbR';



exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.sendEmail = functions.https.onCall((email, name) => {
  // [START eventAttributes]
  //const email = user.email; // The email of the user.
  //const displayName = user.displayName; // The display name of the user.
  // [END eventAttributes]

  return sendWelcomeEmail(email, name);
});

async function sendWelcomeEmail(email, displayName) {
  const mailOptions = {
    from: `${APP_NAME} <noreply@firebase.com>`,
    to: email,
  };

  // The user subscribed to the newsletter.
  mailOptions.subject = `Welcome to ${APP_NAME}!`;
  mailOptions.text = `Hey ${displayName || ''}! Welcome to ${APP_NAME}. I hope you will enjoy our service.`;
  await mailTransport.sendMail(mailOptions);
  console.log('New welcome email sent to:', email);
  return null;
}
