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
