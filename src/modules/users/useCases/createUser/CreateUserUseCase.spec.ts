import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";
import { ICreateUserDTO } from "./ICreateUserDTO";

let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });
  it("Should create an user succesfully", async () => {
    const user: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "peter",
      password: "123",
    };
    const result = await createUserUseCase.execute(user);

    expect(result).toHaveProperty("id");
  });
  it("Should not create an 2 users with the same email", async () => {
    const user: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "peter",
      password: "123",
    };
    const user2: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "jhon",
      password: "456",
    };
    await createUserUseCase.execute(user);

    expect(
      async () => await createUserUseCase.execute(user2)
    ).rejects.toBeInstanceOf(CreateUserError);
  });
});
