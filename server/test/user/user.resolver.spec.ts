import { Test, TestingModule } from "@nestjs/testing";
import { UserResolver } from "../../src/user/user.resolver";
import { UserService } from "../../src/user/user.service";
import { AdminGuard } from "../../src/guards/admin.guard";
import { GuestGuard } from "../../src/guards/guest.guard";
import { CreateUserInput } from "../../src/user/dto/create-user.input";
import { UpdateUserInput } from "src/user/dto/update-user.input";
import { CreateUserResponse } from "src/user/dto/create-user-response";
import { User } from "../../src/user/entities/user.entity";
import * as bcrypt from "bcrypt";

describe("UserResolver", () => {
  let resolver: UserResolver;
  let service: UserService;
  let user: User;
  let user2: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AdminGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(GuestGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    resolver = module.get<UserResolver>(UserResolver);
    service = module.get<UserService>(UserService);

    user = {
      id: "1",
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      password: "password",
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    user2 = {
      id: "2",
      firstName: "Test",
      lastName: "User",
      email: "test2@example.com",
      password: "password",
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it("resolver should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const createUserInput: CreateUserInput = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password",
      };

      const createUserResponse: CreateUserResponse = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };

      jest.spyOn(service, "create").mockResolvedValue(createUserResponse);

      expect(await resolver.createUser(createUserInput)).toEqual(
        createUserResponse
      );
      expect(service.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const ctx = { user: { id: "1" } };

      const updateUserInput: UpdateUserInput = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };

      jest.spyOn(service, "update").mockResolvedValue(user);

      expect(await resolver.updateUser(ctx, "1", updateUserInput)).toEqual(
        user
      );
      expect(service.update).toHaveBeenCalledWith("1", updateUserInput);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      jest.spyOn(service, "remove").mockResolvedValue(user);

      expect(await resolver.deleteUser("1")).toEqual(user);
      expect(service.remove).toHaveBeenCalledWith("1");
    });
  });

  describe("users", () => {
    it("should return an array of users", async () => {
      const users: User[] = [user, user2];
      jest.spyOn(service, "findAll").mockResolvedValue(users);

      expect(await resolver.users()).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("user", () => {
    it("should return a user", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(user);

      expect(await resolver.user("1")).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith("1");
    });
  });
});
