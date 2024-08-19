import { createTransport } from "nodemailer";
import "dotenv/config";
import { __dirname } from "../utils.js";
import path from "path";
import { template } from "./template.js";
import hbs from "nodemailer-express-handlebars";

export const transporter = createTransport({
  host: process.env.HOST,
  port: process.env.PORT_ETHEREAL,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

export const transporterGmail = createTransport({
  service: "gmail",
  port: process.env.PORT_GMAIL,
  secure: true,
  auth: {
    user: process.env.EMAIL_GMAIL,
    pass: process.env.PASS_GMAIL,
  },
});

export const mailOptionsEthereal = {
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: "Bienvenido/a",
  html: template("Alejandro"),
};

/* ------------------------------------ - ----------------------------------- */

const handlebarsOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("./src/views"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./src/views"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarsOptions));

export const mailOptionsEtherealHbs = {
  from: process.env.EMAIL,
  to: process.env.EMAIL,
  subject: "Bienvenido/a",
  template: "email",
  context: {
    title: "Este es un email enviado con una plantilla de handlebars",
    text: "bla bla bla ......",
  },
};

import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

export const sendPasswordRecoveryEmail = async (email, resetLink) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_GMAIL,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <p>Haga clic en el siguiente enlace para restablecer su contraseña:</p>
        <a href="${resetLink}">Restablecer contraseña</a>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    };

    await transporterGmail.sendMail(mailOptions);
    console.log(`Correo de recuperación enviado a: ${email}`);
  } catch (error) {
    console.error("Error enviando el correo de recuperación:", error);
  }
};

export default sgMail;
