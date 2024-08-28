import { expect } from "chai";
import supertest from "supertest";
import app from "../src/server.js";

const request = supertest(app);

describe("Carts API", () => {
  it("Debe obtener la lista de carritos", async function () {
    const response = await request.get("/carts");
    expect(response.status).to.equal(200);
    expect(response.body).to.be.an("array");
  });

  it("Debe crear un carrito", async function () {
    const newCart = {
      products: [{ productId: "66cb91c283f37311c7d65c78", quantity: 2 }],
    };

    const response = await request.post("/carts").send(newCart);
    expect(response.status).to.equal(201);
    expect(response.body).to.have.property("_id");
  });
});
