import { expect } from "chai";
import supertest from "supertest";
import app from "../src/server.js";

const request = supertest(app);

describe("Products API", function () {
  let cookie;

  before(async function () {
    const loginResponse = await request.post("/users/loginp").send({
      email: "premiumuser@example.com",
      password: "testpassword",
    });

    // Verificacion de cookie
    cookie = loginResponse.headers["set-cookie"];
    console.log("Cookie obtenida después de iniciar sesión:", cookie);

    // error cookie
    if (!cookie) {
      throw new Error("No se pudo obtener la cookie de sesión");
    }
  });

  it("Debe crear un producto", async function () {
    const productData = {
      title: "Nuevo Producto",
      description: "Descripción del nuevo producto",
      price: 100,
      stock: 50,
      category: "Electrónica",
      code: "PRD001",
    };

    const response = await request
      .post("/products")
      .set("Cookie", cookie) // cookie session
      .send(productData);

    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
    expect(response.body.title).to.equal(productData.title);
  });
});
