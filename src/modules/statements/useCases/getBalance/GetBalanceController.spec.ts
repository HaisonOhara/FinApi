import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../conectionConfig";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
describe("User Balance", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuid();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO USERS (id,name, email, password )
    values('${id}', 'admin', 'admin@rentx.com.br', '${password}')
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it("should be able to get user's balance", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const token = response.body.token;
    const getUserBalanceResponse = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(getUserBalanceResponse.body).toHaveProperty("statement");
    expect(getUserBalanceResponse.body).toHaveProperty("balance");

    expect(getUserBalanceResponse.status).toBe(200);
  });
});
