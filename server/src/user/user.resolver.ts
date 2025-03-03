import { Resolver, Query, Mutation, Args, ID, Context } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { UpdateUserInput } from "./dto/update-user.input";
import { AdminGuard } from "../guards/admin.guard";
import { AuthGuard } from "../guards/auth.guard";
import { CreateUserResponse } from "./dto/create-user-response";

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => CreateUserResponse)
  async createUser(
    @Args("createUserInput") createUserInput: CreateUserInput
  ): Promise<CreateUserResponse> {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard)
  async updateUser(
    @Context() ctx,
    @Args("id", { type: () => ID }) id: string,
    @Args("updateUserInput") updateUserInput: UpdateUserInput
  ): Promise<User> {
    return this.userService.update(ctx, id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AuthGuard, AdminGuard)
  async deleteUser(@Args("id", { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(AuthGuard, AdminGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async user(@Args("id") id: string) {
    return this.userService.findOne(id);
  }
}
