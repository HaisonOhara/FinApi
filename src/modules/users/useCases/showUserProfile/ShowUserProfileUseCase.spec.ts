import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";

import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
describe("Show User Profile", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(userRepositoryInMemory);
  });
  it("Should return user`s information", async () => {
    const userEmail = "teste.email@outlook.com";
    const user: ICreateUserDTO = {
      email: userEmail,
      name: "peter",
      password: "123",
    };
    userRepositoryInMemory.create(user);
    const { id } = await userRepositoryInMemory.findByEmail(userEmail);

    const result = await showUserProfileUseCase.execute(id);

    expect(result.name).toEqual(user.name);
  });
});
