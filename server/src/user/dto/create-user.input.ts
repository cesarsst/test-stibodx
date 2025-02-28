import { InputType, Field } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @MinLength(2)
  firstName: string;

  @Field()
  @IsNotEmpty()
  @MinLength(2)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;
}
