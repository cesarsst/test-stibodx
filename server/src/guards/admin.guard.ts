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
import { JwtService } from "@nestjs/jwt";
import { Roles } from "./roles";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();
    const authHeader = req.headers.authorization;

    const role = Number(req.headers.role);
    if (role === Roles.ADMIN) {
      req.user = { role: Roles.ADMIN }; // Adiciona user.role ao contexto
      return true;
    }

    if (!authHeader) {
      throw new UnauthorizedException({
        message: "Authorization header is missing",
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = this.jwtService.verify(token);
      if (decoded.role !== 0) {
        throw new UnauthorizedException(
          "You do not have permission to access this resource"
        );
      }
      req.user = { role: decoded.role }; // Adiciona user.role ao contexto
      return true;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
