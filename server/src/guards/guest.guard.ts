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
export class GuestGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const role = Number(req.headers.role); // Needed to change to decoded the JWT token
    if (role === Roles.ADMIN) {
      req.user = { role: Roles.ADMIN }; // Adiciona user.role ao contexto
      return true;
    } else {
      req.user = { role: Roles.GUEST }; // Adiciona user.role ao contexto
      return true;
    }
  }
}
