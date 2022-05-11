import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
describe("User Balance", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();

    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepository,
      userRepositoryInMemory
    );
  });
  it("Should return user`s balance", async () => {
    const userInput: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "peter",
      password: "123",
    };
    const user = await userRepositoryInMemory.create(userInput);
    const balance = await getBalanceUseCase.execute({ user_id: user.id });

    expect(balance).toHaveProperty("balance");
  });
});
