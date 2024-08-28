import { expect } from "chai";
import supertest from "supertest";
import app from "../src/server.js";

const request = supertest(app);

describe("Sessions API", () => {
  it("Debe iniciar sesión con credenciales válidas", async function () {
    const validCredentials = {
      email: "testuser@example.com",
      password: "password123",
    };

    const response = await request.post("/users/loginp").send(validCredentials);
    expect(response.status).to.equal(200);
  });

  it("Debe fallar al iniciar sesión con credenciales inválidas", async function () {
    const invalidCredentials = {
      email: "wronguser@example.com",
      password: "wrongpassword",
    };

    const response = await request
      .post("/users/loginp")
      .send(invalidCredentials);
    expect(response.status).to.equal(401);
  });

  it("Debe cerrar sesión correctamente", async function () {
    const response = await request.post("/users/logout");
    expect(response.status).to.equal(302); // Cambia la expectativa a 302
  });
});
