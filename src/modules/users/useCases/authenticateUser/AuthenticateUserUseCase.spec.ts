import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { User } from "@modules/users/entities/User";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";

import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;

let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate an User", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
  });
  it("Should return an authenticate user", async () => {
    const user: ICreateUserDTO = {
      name: "user",
      email: "email.test@outlook.com",
      password: "123",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toHaveProperty("token");
  });
});
