import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { UserService } from "../../src/user/user.service";
import { User } from "../../src/user/entities/user.entity";
import { NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { BadRequestException } from "@nestjs/common";
import { CreateUserInput } from "../../src/user/dto/create-user.input";
import { CreateUserResponse } from "../../src/user/dto/create-user-response";

describe("UserService", () => {
  let service: UserService;
  let repository: Repository<User>;
  let user: User;
  let user2: User;
  let context: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));

    user = {
      id: "1",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 0,
    };

    user2 = {
      id: "2",
      firstName: "Test",
      lastName: "User",
      email: "test2@example.com",
      password: "password",
      createdAt: new Date(),
      updatedAt: new Date(),
      role: 0,
    };

    context = { req: { user: { id: "1" } } };
  });

  it("service should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const createUserInput: CreateUserInput = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password",
      };

      const createUserResponse: CreateUserResponse = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      jest.spyOn(repository, "create").mockReturnValue(user as any);
      jest.spyOn(repository, "save").mockResolvedValue(user as any);

      expect(await service.create(createUserInput)).toEqual(createUserResponse);
    });
  });

  describe("deleted", () => {
    it("should delete a user by id", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(user as any);
      jest.spyOn(repository, "remove").mockResolvedValue(user as any);
      expect(await service.remove("1")).toEqual(user);
    });

    it("should throw NotFoundException if user not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      await expect(service.remove("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update a user by id", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(user as any);
      jest.spyOn(repository, "save").mockResolvedValue(user as any);
      expect(
        await service.update(context, "1", { firstName: "Updated User" })
      ).toEqual(user);
    });

    it("should throw NotFoundException if user not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      await expect(
        service.update(context, "1", { firstName: "Updated User" })
      ).rejects.toThrow(NotFoundException);
    });

    it("should throw BadRequestException if no fields to update", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(user as any);
      await expect(service.update(context, "1", {})).rejects.toThrow(
        BadRequestException
      );
    });

    it("should throw BadRequestException if email is already in use", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValueOnce(user as any);
      jest.spyOn(repository, "findOne").mockResolvedValueOnce(user2 as any);

      await expect(
        service.update(context, "1", { email: "test2@example.com" })
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe("findOne", () => {
    it("should find a user by id", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(user as any);
      expect(await service.findOne("1")).toEqual(user);
    });

    it("should throw NotFoundException if user not found", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(null);
      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const users = [user, user2];
      jest.spyOn(repository, "find").mockResolvedValue(users as User[]);
      expect(await service.findAll()).toEqual(users);
    });
  });

  describe("findOneByEmail", () => {
    it("should find a user by email", async () => {
      jest.spyOn(repository, "findOne").mockResolvedValue(user as any);
      expect(await service.findOneByEmail(user.email)).toEqual(user);
    });
  });
});
