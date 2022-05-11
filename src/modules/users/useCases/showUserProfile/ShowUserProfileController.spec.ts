import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../conectionConfig";
import { hash } from "bcryptjs";
import { v4 as uuid } from "uuid";
import { app } from "../../../../app";

let connection: Connection;
describe("Show User Information", () => {
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
  it("should be able return user information", async () => {
    const response = await request(app).post("/api/v1/sessions").send({
      email: "admin@rentx.com.br",
      password: "admin",
    });

    const token = response.body.token;
    const getUserInfoResponse = await request(app)
      .get("/api/v1/profile")
      .set({ Authorization: `Bearer ${token}` });

    expect(getUserInfoResponse.body.name).toBe("admin");
    expect(getUserInfoResponse.body.email).toBe("admin@rentx.com.br");
    expect(getUserInfoResponse.status).toBe(200);
  });
});
