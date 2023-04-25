"use strict";
const nodemailer = require("nodemailer");

async function sendMail(to, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "saraogi.anuj66@gmail.com",
      pass: "innekidtokbnxukc",
    },
  });

  let info = await transporter.sendMail({
    from: "saraogi.anuj66@gmail.com",
    to: to,
    subject: subject,
    text: text,
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

module.exports = sendMail;
