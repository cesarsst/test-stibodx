/**
 * Middleware to check the role of the user before allowing access to a specific field.
 *
 * This middleware checks the role of the user from the request context and compares it
 * with the required role specified in the field's extensions. If the user's role does not
 * match the required role, a ForbiddenException is thrown.
 *
 * @param ctx - The middleware context containing information about the field and request.
 * @param next - The next function to call in the middleware chain.
 * @returns The result of the next function if the user has the required role.
 * @throws {ForbiddenException} If the user does not have the required role to access the field.
 */
import { FieldMiddleware, MiddlewareContext, NextFn } from "@nestjs/graphql";
import { ForbiddenException } from "@nestjs/common";

export const checkRoleMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  const { info, context } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  const userRole = context.req.user.role; // Acessa user.role do contexto da requisição
  if (userRole !== extensions.role) {
    throw new ForbiddenException(
      `User does not have sufficient permissions to access "${info.fieldName}" field.`
    );
  }
  return next();
};
