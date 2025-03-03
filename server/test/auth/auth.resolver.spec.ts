import { Test, TestingModule } from "@nestjs/testing";
import { AuthResolver } from "../../src/auth/auth.resolver";
import { AuthService } from "../../src/auth/auth.service";
import { AuthRequest } from "../../src/auth/dto/auth-request";
import { AuthResponse } from "../../src/auth/dto/auth-response";
import { User } from "../../src/user/entities/user.entity";

describe("AuthResolver", () => {
  let resolver: AuthResolver;
  let authService: AuthService;
  let authRequest: AuthRequest;
  let user: User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthResolver,
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<AuthResolver>(AuthResolver);
    authService = module.get<AuthService>(AuthService);
    authRequest = { email: "test", password: "test" };
    user = {
      id: "1",
      email: "test",
      firstName: "test",
      lastName: "test",
      password: "password",
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  describe("login", () => {
    it("should return an AuthResponse", async () => {
      const authInput: AuthRequest = { email: "test", password: "test" };
      const authResponse: AuthResponse = {
        token: "test",
      };

      jest.spyOn(authService, "login").mockResolvedValue(authResponse);

      expect(await resolver.login(authInput)).toEqual(authResponse);
    });
  });
});
