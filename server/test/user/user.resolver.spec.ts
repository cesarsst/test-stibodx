import { Test, TestingModule } from "@nestjs/testing";
import { UserResolver } from "../../src/user/user.resolver";
import { UserService } from "../../src/user/user.service";
import { AdminGuard } from "../../src/guards/admin.guard";
import { GuestGuard } from "../../src/guards/guest.guard";
import { CreateUserInput } from "../../src/user/dto/create-user.input";
import { User } from "../../src/user/entities/user.entity";

describe("UserResolver", () => {
  let resolver: UserResolver;
  let service: UserService;

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
      };
      const user: User = {
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, "create").mockResolvedValue(user);

      expect(await resolver.createUser(createUserInput)).toEqual(user);
      expect(service.create).toHaveBeenCalledWith(createUserInput);
    });
  });

  describe("updateUser", () => {
    it("should update a user", async () => {
      const updateUserInput: CreateUserInput = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
      };
      const user: User = {
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@exemple.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(service, "update").mockResolvedValue(user);

      expect(await resolver.updateUser("1", updateUserInput)).toEqual(user);
      expect(service.update).toHaveBeenCalledWith("1", updateUserInput);
    });
  });

  describe("deleteUser", () => {
    it("should delete a user", async () => {
      const user: User = {
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@exemple.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, "remove").mockResolvedValue(user);

      expect(await resolver.deleteUser("1")).toEqual(user);
      expect(service.remove).toHaveBeenCalledWith("1");
    });
  });

  describe("users", () => {
    it("should return an array of users", async () => {
      const users: User[] = [
        {
          id: "1",
          firstName: "Test",
          lastName: "User",
          email: "test@exemple.com",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, "findAll").mockResolvedValue(users);

      expect(await resolver.users()).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe("user", () => {
    it("should return a user", async () => {
      const user: User = {
        id: "1",
        firstName: "Test",
        lastName: "User",
        email: "test@exemple.com",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, "findOne").mockResolvedValue(user);

      expect(await resolver.user("1")).toEqual(user);
      expect(service.findOne).toHaveBeenCalledWith("1");
    });
  });
});
