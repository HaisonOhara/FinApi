import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../conectionConfig";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
describe("User Statement", () => {
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

  afterEach(async () => {
    await connection.getRepository("statements").clear();
  });

  it("should be able to make a deposit", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const token = response.body.token;
    console.log("Token", token);
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Salário",
      })
      .set({ Authorization: `Bearer ${token}` });

    const depositResponse2 = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 100,
        description: "Salário",
      })
      .set({ Authorization: `Bearer ${token}` });

    const getUserBalanceResponse = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });

    expect(getUserBalanceResponse.body.balance).toBe(200);
    expect(getUserBalanceResponse.body.statement.length).toBe(2);
    expect(depositResponse.status).toBe(201);
  });
  it("should be able to make a withdraw", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const token = response.body.token;
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 400,
        description: "Salário",
      })
      .set({ Authorization: `Bearer ${token}` });

    const withdrawResponse = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 100,
        description: "Retirada",
      })
      .set({ Authorization: `Bearer ${token}` });

    const getUserBalanceResponse = await request(app)
      .get("/api/v1/statements/balance")
      .set({ Authorization: `Bearer ${token}` });
    expect(getUserBalanceResponse.body.balance).toBe(300);
    expect(getUserBalanceResponse.body.statement.length).toBe(2);
    expect(withdrawResponse.status).toBe(201);
  });
  it("should be able to check statements information", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const token = response.body.token;
    const depositResponse = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 300,
        description: "Salário",
      })
      .set({ Authorization: `Bearer ${token}` });

    const statementResponse = await request(app)
      .get(`/api/v1/statements/${depositResponse.body.id}`)
      .set({ Authorization: `Bearer ${token}` });

    expect(depositResponse.body.id).toBe(statementResponse.body.id);
  });
});
