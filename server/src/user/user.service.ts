import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { CreateUserResponse } from "./dto/create-user-response";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { Roles } from "../config/roles";
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserInput: CreateUserInput): Promise<CreateUserResponse> {
    const passwordHash = await bcrypt.hash(createUserInput.password, 10);
    createUserInput.password = passwordHash;
    const user = this.userRepository.create(createUserInput);
    await this.userRepository.save(user);
    const response: CreateUserResponse = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return response;
  }

  async update(
    ctx: any,
    id: string,
    updateUserInput: Partial<CreateUserInput>
  ): Promise<User> {
    if (
      (!ctx.req.user || ctx.req.user.id !== id) &&
      ctx.req.user.role !== Roles.ADMIN
    ) {
      throw new BadRequestException("Unauthorized");
    }

    let user = await this.findOne(id);
    if (Object.keys(updateUserInput).length === 0 || !user) {
      throw new BadRequestException("No fields to update");
    }

    if (updateUserInput.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email: updateUserInput.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException("Email is already in use");
      }
    }

    user = { ...user, ...updateUserInput };
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    return await this.userRepository.remove(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
