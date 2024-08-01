import { dirname } from "path";
import { fileURLToPath } from "url";
export const __dirname = dirname(fileURLToPath(import.meta.url));
export const createResponse = (res, statusCode, data) => {
  return res.status(statusCode).json({ data });
};
export default {
  MONGO_URL: process.env.MONGO_URL,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT: process.env.CLIENT,
  SECRET_KEY: process.env.SECRET_KEY,
  CALLBACK_URL: process.env.CALLBACK_URL,
  CLIENT_ID_GOOGLE: process.env.CLIENT_ID_GOOGLE,
  CLIENT_SECRET_GOOGLE: process.env.CLIENT_SECRET_GOOGLE,
  CALLBACK_URL_GOOGLE: process.env.CALLBACK_URL_GOOGLE,
  PORT: process.env.PORT,
  USER_ADMIN: process.env.USER_ADMIN,
  PASSWORD_ADMIN: process.env.PASSWORD_ADMIN,
  HOST: process.env.HOST,
  USER_MAIL: process.env.USER_MAIL,
  PASSWORD_MAIL: process.env.PASSWORD_MAIL,
  NAME_MAIL: process.env.NAME_MAIL,
  PORT_MAIL: process.env.PORT_MAIL,
  EMAIL_GMAIL: process.env.EMAIL_GMAIL,
  PORT_GMAIL: process.env.PORT_GMAIL,
  PASS_GMAIL: process.env.PASS_GMAIL,
};
