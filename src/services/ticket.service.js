import Services from "./class.services.js";
import CartServices from "./cart.service.js";
import ProductService from "./product.services.js";
import TicketDaoMongo from "../daos/mongodb/ticket.dao.js";
import { sendGmailWithTicket } from "../controllers/email.controller.js"; // Importa el controlador del email

const ticketDao = new TicketDaoMongo();
const productService = new ProductService();
const cartService = new CartServices();

export default class TicketService extends Services {
  constructor() {
    super(ticketDao);
  }

  async generateTicket(user) {
    try {
      const cart = await cartService.getById(user.cartId);
      if (!cart) return null;

      let amountAcc = 0;
      const products = [];

      if (cart.products.length > 0) {
        for (const prodInCart of cart.products) {
          const idProd = prodInCart.productId;
          const prodDB = await productService.getById(idProd);

          if (prodInCart.quantity <= prodDB.stock) {
            const amount = prodInCart.quantity * prodDB.price;
            amountAcc += amount;
            products.push({
              name: prodDB.title,
              quantity: prodInCart.quantity,
              price: prodDB.price,
              total: amount,
            });
          } else return null;
        }
      }

      const ticket = await this.dao.create({
        code: `${Math.floor(Math.random() * 1000)}`,
        purchase_datetime: new Date().toLocaleString(),
        amount: amountAcc,
        purchaser: user.email,
        products: products,
      });

      await cartService.deleteAllProducts(user.cartId);

      // Envía el correo con la información del ticket
      await sendGmailWithTicket(user.email, ticket);

      return ticket;
    } catch (error) {
      throw new Error(error);
    }
  }
}
