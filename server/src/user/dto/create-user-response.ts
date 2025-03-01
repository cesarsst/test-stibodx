import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType()
export class CreateUserResponse {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;
}
