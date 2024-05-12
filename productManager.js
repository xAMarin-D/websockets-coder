const fs = require("fs");
const readline = require("readline");

class ProductManager {
  #priceBase = 5; // Precio base que se añade a cada producto

  constructor(path) {
    this.path = path;
  }

  async getProducts() {
    try {
      if (fs.existsSync(this.path)) {
        const data = await fs.promises.readFile(this.path, "utf8");
        return JSON.parse(data || "[]");
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error reading file:", error);
      return [];
    }
  }

  #getMaxId(products) {
    let maxId = 0;
    products.forEach((product) => {
      if (product.id && product.id > maxId) maxId = product.id;
    });
    return maxId;
  }

  async addProduct(title, description, price, thumbnail, code, stock = 50) {
    const products = await this.getProducts();
    const maxId = await this.#getMaxId(products);
    const product = {
      id: maxId + 1,
      title,
      description,
      price: price + this.#priceBase,
      thumbnail,
      code,
      stock,
    };
    products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
  }

  async getProductById(idProduct) {
    const products = await this.getProducts();
    const product = products.find((product) => product.id === idProduct);
    if (product) {
      return product;
    } else {
      return null;
    }
  }

  async updateProduct(idProduct, updatedFields) {
    const products = await this.getProducts();
    const productIndex = products.findIndex(
      (product) => product.id === idProduct
    );
    if (productIndex === -1) {
      console.log("Producto no encontrado para actualizar");
      return false;
    }

    Object.keys(updatedFields).forEach((key) => {
      if (key !== "id") {
        //no sobrescribir el ID
        products[productIndex][key] = updatedFields[key];
      }
    });

    await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
    return true;
  }
}

const manager = new ProductManager("./products.json");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function initializeAndListProducts() {
  console.log("Productos inicialmente:", await manager.getProducts());

  await manager.addProduct(
    "Producto 1",
    "Descripción del producto 1",
    25,
    "thumbnail1.jpg",
    "CODE1"
  );
  console.log("Productos después de añadir:", await manager.getProducts());
}

async function modifyProductFlow() {
  rl.question(
    "¿Desea modificar algún producto? (si/no): ",
    async (modifyResponse) => {
      if (modifyResponse.toLowerCase() === "si") {
        rl.question(
          "Ingrese el ID del producto a modificar: ",
          async (idInput) => {
            const productId = parseInt(idInput);
            const product = await manager.getProductById(productId);
            if (product) {
              console.log(
                "Ingrese los nuevos valores del producto (deje en blanco para no modificar):"
              );
              rl.question("Nuevo título: ", async (newTitle) => {
                const updates = {};
                if (newTitle) updates.title = newTitle;
                await manager.updateProduct(productId, updates);
                console.log("Producto actualizado con éxito.");
                rl.close();
              });
            } else {
              console.log(
                "No se encontró ningún producto con el ID:",
                productId
              );
              rl.close();
            }
          }
        );
      } else {
        rl.close();
      }
    }
  );
}

async function main() {
  await initializeAndListProducts();
  await new Promise((resolve) =>
    rl.question("Ingrese el ID del producto: ", async (idInput) => {
      const productId = parseInt(idInput);
      const product = await manager.getProductById(productId);
      if (product) {
        console.log("Producto encontrado:", product);
        resolve();
      } else {
        console.log("No se encontró ningún producto con el ID:", productId);
        resolve();
      }
    })
  );
  modifyProductFlow();
}

main();
