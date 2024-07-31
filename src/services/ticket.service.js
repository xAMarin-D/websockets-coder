import Services from "./class.services.js";
import CartServices from "./cart.service.js";
import ProductService from "./product.services.js";
import TicketDaoMongo from "../daos/mongodb/ticket.dao.js";

const ticketDao = new TicketDaoMongo();
const productService = new ProductService();
const cartService = new CartServices();

export default class TicketService extends Services {
  constructor() {
    super(ticketDao);
  }

  async generateTicket(user) {
    try {
      //console.log(user.cartId);
      const cart = await cartService.getById(user.cartId);
      if (!cart) return null;
      //console.log(cart);
      let amountAcc = 0;
      if (cart.products.length > 0) {
        for (const prodInCart of cart.products) {
          //   const idProd = prodInCart._id._id.toHexString();
          const idProd = prodInCart.productId;
          console.log(prodInCart.productId);
          const prodDB = await productService.getById(idProd);

          if (prodInCart.quantity <= prodDB.stock) {
            const amount = prodInCart.quantity * prodDB.price;
            amountAcc += amount;
          } else return null;
        }
      }

      const ticket = await this.dao.create({
        code: `${Math.floor(Math.random() * 1000)}`,
        purchase_datetime: new Date().toLocaleString(),
        amount: amountAcc,
        purchaser: user.email,
      });

      await cartService.deleteAllProducts(user.cartId);

      return ticket;
    } catch (error) {
      throw new Error(error);
    }
  }
}
