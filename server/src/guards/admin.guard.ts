/**
 * Guard that restricts access to routes for admin users only.
 *
 * This guard checks if the user making the request has an admin role.
 * If the user is not an admin, an UnauthorizedException is thrown.
 *
 * @class
 * @implements {CanActivate}
 */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Roles } from "../config/roles";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    if (!req.user || req.user.role !== Roles.ADMIN) {
      throw new UnauthorizedException("Unauthorized");
    }

    return true;
  }
}
