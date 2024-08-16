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
      // Verifica que el usuario tenga un cartId
      if (!user.cartId) {
        throw new Error("No se encontró un carrito para el usuario.");
      }

      const cart = await cartService.getById(user.cartId); // Aquí debe usar el cartId del usuario
      if (!cart) {
        throw new Error("No se encontró el carrito.");
      }

      let amountAcc = 0;
      const products = [];

      // Asegúrate de que estás iterando sobre los productos del carrito y no confundiendo el ID
      if (cart.products.length > 0) {
        for (const prodInCart of cart.products) {
          const idProd = prodInCart.productId; // Esto debe ser el ID del producto en el carrito
          const prodDB = await productService.getById(idProd); // Consulta la base de datos de productos

          if (!prodDB) {
            throw new Error(`Producto con ID ${idProd} no encontrado.`);
          }

          if (prodInCart.quantity <= prodDB.stock) {
            const amount = prodInCart.quantity * prodDB.price;
            amountAcc += amount;
            products.push({
              name: prodDB.title,
              quantity: prodInCart.quantity,
              price: prodDB.price,
              total: amount,
            });
          } else {
            throw new Error(
              `No hay suficiente stock para el producto con ID ${idProd}.`
            );
          }
        }
      }

      const ticket = await this.dao.create({
        code: `${Math.floor(Math.random() * 1000)}`,
        purchase_datetime: new Date().toLocaleString(),
        amount: amountAcc,
        purchaser: user.email,
        products: products,
      });

      await cartService.deleteAllProducts(user.cartId); // Limpiar el carrito después de la compra
      await sendGmailWithTicket(user.email, ticket); // Envía el ticket por correo

      return ticket;
    } catch (error) {
      throw new Error(error);
    }
  }
}
