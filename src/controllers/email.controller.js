// Importaciones y configuraciones necesarias
import sgMail, {
  transporter,
  transporterGmail,
} from "../services/email.service.js";
import "dotenv/config";
import { template } from "../services/template.js";
import path from "path";

// Función para enviar correo con la información del ticket
export const sendGmailWithTicket = async (dest, ticket) => {
  try {
    const gmailOptions = {
      from: process.env.EMAIL_GMAIL,
      to: dest,
      subject: "Resumen de tu compra",
      html: template(ticket), // Pasa el ticket al template
      attachments: [
        {
          path: path.resolve("./src/services/texto.txt"),
          filename: "resumen-de-cuenta.txt",
        },
      ],
    };
    const response = await transporterGmail.sendMail(gmailOptions);
    console.log("Email enviado con la información del ticket!");
    return response;
  } catch (error) {
    console.log(error);
  }
};

// Otros métodos si los hay, asegúrate de exportarlos también
