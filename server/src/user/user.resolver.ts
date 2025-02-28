import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  Extensions,
} from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { AdminGuard } from "../guards/admin.guard";
import { GuestGuard } from "../guards/guest.guard";
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  @UseGuards(AdminGuard)
  async createUser(
    @Args("createUserInput") createUserInput: CreateUserInput
  ): Promise<User> {
    return await this.userService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AdminGuard)
  async updateUser(
    @Args("id", { type: () => ID }) id: string,
    @Args("updateUserInput") updateUserInput: CreateUserInput
  ): Promise<User> {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(AdminGuard)
  async deleteUser(@Args("id", { type: () => ID }) id: string) {
    return this.userService.remove(id);
  }

  @UseGuards(GuestGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @UseGuards(GuestGuard)
  @Query(() => User)
  async user(@Args("id") id: string) {
    return this.userService.findOne(id);
  }
}
