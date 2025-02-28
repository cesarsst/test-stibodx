import { Injectable, NotFoundException, UseGuards } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { CreateUserInput } from "./dto/create-user.input";
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    const user = this.userRepository.create(createUserInput);
    return await this.userRepository.save(user);
  }

  async update(
    id: string,
    updateUserInput: Partial<CreateUserInput>
  ): Promise<User> {
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
}
