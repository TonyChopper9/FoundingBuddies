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

exports.sendMail = functions.https.onCall((data, context) => {

        // getting dest email by query string
        const fromName = data.fromName;
        const dest = data.to;
        const subject = data.subject;
        const content = data.subject;

        const mailOptions = {
            from: 'FoundingBuddies@gmail.com',
            to: dest,
            subject: 'I\'M A PICKLE!!!', // email subject
            html: `<p style="font-size: 16px;">Pickle Riiiiiiiiiiiiiiiick!!</p>
                <br />
                <img src="https://images.prod.meredith.com/product/fc8754735c8a9b4aebb786278e7265a5/1538025388228/l/rick-and-morty-pickle-rick-sticker" />
            ` // email content in HTML
        };

        // returning result
        transporter.sendMail(mailOptions, (erro, info) => {
            if(erro){
              return res.send(erro.toString());
            }
            else {
              return res.send('Sended');
            }

        });
});
