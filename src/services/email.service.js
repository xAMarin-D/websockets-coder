import { createTransport } from "nodemailer";
import "dotenv/config";
import { __dirname } from "../utils.js";
import path from "path";
import { template } from "./template.js";
import hbs from "nodemailer-express-handlebars";
import sgMail from "@sendgrid/mail";

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

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

// Función para enviar el correo de recuperación de contraseña
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

// desactivar x inactividad
export const sendInactivityEmail = async (email) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_GMAIL,
      to: email,
      subject: "Cuenta eliminada por inactividad",
      html: `
        <p>Tu cuenta ha sido eliminada por inactividad.</p>
        <p>Si crees que esto es un error, por favor contacta con soporte.</p>
      `,
    };

    await transporterGmail.sendMail(mailOptions);
    console.log(`Correo de inactividad enviado a: ${email}`);
  } catch (error) {
    console.error("Error enviando el correo de inactividad:", error);
    throw new Error("No se pudo enviar el correo de inactividad.");
  }
};

export const sendProductDeletionEmail = async (email, productName) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_GMAIL,
      to: email,
      subject: "Producto eliminado",
      html: `
        <p>Estimado usuario,</p>
        <p>Uno de tus productos ha sido eliminado de nuestro catálogo.</p>
        <p>Gracias por utilizar nuestros servicios.</p>
      `,
    };

    await transporterGmail.sendMail(mailOptions);
    console.log(`Correo enviado a: ${email}`);
  } catch (error) {
    console.error("Error enviando el correo:", error);
  }
};

export default sgMail;
