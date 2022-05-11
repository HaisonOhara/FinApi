import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("Get Statement Operation Use Case Test", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementsRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      userRepositoryInMemory,
      statementsRepository
    );
  });
  it("should return operation information successfully", async () => {
    const userInput: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "peter",
      password: "123",
    };
    const user = await userRepositoryInMemory.create(userInput);

    const deposit: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "déposito",
    };

    const statement = await createStatementUseCase.execute(deposit);
    const result = await getStatementOperationUseCase.execute({
      user_id: user.id,
      statement_id: statement.id,
    });

    await expect(result).toHaveProperty("amount");
    expect(result.amount).toBe(200);
    expect(result.type).toBe(OperationType.DEPOSIT);
  });
});
