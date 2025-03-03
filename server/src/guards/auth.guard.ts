/**
 * AuthGuard is a custom guard that implements the CanActivate interface to protect
 * GraphQL endpoints by verifying the JWT token provided in the Authorization header.
 *
 * @class
 * @implements {CanActivate}
 *
 * @constructor
 * @param {JwtService} jwtService - The JWT service used to verify the token.
 *
 * @method canActivate
 * @param {ExecutionContext} context - The execution context that provides details about the current request.
 * @returns {boolean} - Returns true if the token is valid and the user has the required role, otherwise throws an UnauthorizedException.
 *
 * @throws {UnauthorizedException} - Throws an exception if the Authorization header is missing, the token is invalid, or the user does not have the required role.
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthService } from "../auth/auth.service";
import { Roles } from "../config/roles";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Authorization header is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const user = await this.authService.getUserFromToken(token);
      if (user) {
        req.user = user;
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
