import { OperationType } from "@modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "@modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { ICreateUserDTO } from "@modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";

let userRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;

describe("Create Statement Use Case Test", () => {
  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      userRepositoryInMemory,
      statementsRepository
    );
  });
  it("should create a deposit successfully", async () => {
    const userInput: ICreateUserDTO = {
      email: "teste.email@outlook.com",
      name: "peter",
      password: "123",
    };
    const user = await userRepositoryInMemory.create(userInput);

    const statement: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "déposito",
    };

    const result = await createStatementUseCase.execute(statement);

    expect(result).toHaveProperty("amount");
    expect(result.amount).toBe(200);
  });
  it("should create a withdraw successfully", async () => {
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
    const withdraw: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: "Saque",
    };

    await createStatementUseCase.execute(deposit);
    const result = await createStatementUseCase.execute(withdraw);

    expect(result).toHaveProperty("amount");
    expect(result.amount).toBe(50);
    expect(result.type).toBe(OperationType.WITHDRAW);
  });
  it("should not create a withdraw when funds are not enough", async () => {
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
    const withdraw: ICreateStatementDTO = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 5000,
      description: "Saque",
    };

    await createStatementUseCase.execute(deposit);
    expect(async () => {
      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
  it("should return an error when user no exists", async () => {
    const deposit: ICreateStatementDTO = {
      user_id: "NotExistantUser_id",
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "déposito",
    };
    const withdraw: ICreateStatementDTO = {
      user_id: "NotExistantUser_id",
      type: OperationType.WITHDRAW,
      amount: 5000,
      description: "Saque",
    };

    expect(async () => {
      await createStatementUseCase.execute(deposit);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    expect(async () => {
      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });
});
