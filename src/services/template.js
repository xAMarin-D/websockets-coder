// Verifica que estás pasando un objeto 'ticket' con una propiedad 'products' que sea un array
export const template = (ticket) => {
  // Comprueba que ticket.products exista y sea un array
  const productsList = Array.isArray(ticket.products)
    ? ticket.products
        .map(
          (product) => `
    <tr>
      <td>${product.title}</td>
      <td>${product.quantity}</td>
      <td>${product.price}</td>
    </tr>
  `
        )
        .join("")
    : "";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Resumen de compra</title>
    </head>
    <body>
      <h1>Gracias por tu compra!</h1>
      <p>Este es el resumen de tu compra:</p>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
          </tr>
        </thead>
        <tbody>
          ${productsList}
        </tbody>
      </table>
      <p>Total: ${ticket.amount}</p>
    </body>
    </html>
  `;
};
