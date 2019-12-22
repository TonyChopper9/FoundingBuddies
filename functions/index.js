const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
//const cors = require('cors')({origin: true});
admin.initializeApp();

/**
* Here we're using Gmail to send
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'FoundingBuddies@gmail.com',
        pass: 'BingPot!99'
    }
});

exports.sendNotificationMail = functions.firestore.document("users/{userID}").onUpdate((change, context) => {
  if (change.after.data().newMessage == true) {
    const mailOptions = {
        from: 'FoundingBuddies@gmail.com',
        to: change.after.data().mail,
        subject: 'You have unread messages!',
        text: "Hey " + change.after.data().Username + ",\nThere are new messages in your inbox at www.FoundingBuddies.com.\nCheck it out!"
    };
    transporter.sendMail(mailOptions, (erro, info) => {
        if(erro){
          return erro.toString();
        }
        else {
          console.log("Email send to " + change.after.data().mail);
          return 1;
        }

    });
  }
  else {
    return 1;
  }
});
