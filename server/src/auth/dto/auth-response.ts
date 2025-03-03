import { User } from "../../user/entities/user.entity";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;
}
