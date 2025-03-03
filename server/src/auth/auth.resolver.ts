import { Resolver } from "@nestjs/graphql";
import { Mutation, Args } from "@nestjs/graphql";
import { AuthService } from "./auth.service";
import { AuthRequest } from "./dto/auth-request";
import { AuthResponse } from "./dto/auth-response";

@Resolver()
export class AuthResolver {
  // Add your resolver methods here
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async login(
    @Args("loginInput") authInput: AuthRequest
  ): Promise<AuthResponse> {
    return this.authService.login(authInput);
  }
}
