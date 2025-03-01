import { Injectable } from "@nestjs/common";
import { AuthResponse } from "./dto/auth-response";
import { UserService } from "src/user/user.service";
import { AuthRequest } from "./dto/auth-request";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";

import { BadRequestException } from "@nestjs/common";
import * as bycrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // Add your methods and logic here
  async login(authInput: AuthRequest): Promise<AuthResponse> {
    console.log("🚀 ~ AuthService ~ login ~ authInput:", authInput);
    const user = await this.userService.findOneByEmail(authInput.email);
    console.log("🚀 ~ AuthService ~ login ~ user:", user);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }

    const isPasswordValid = await bycrypt.compare(
      user.password,
      authInput.password
    );

    if (!isPasswordValid) {
      throw new BadRequestException("Invalid credentials");
    }

    return {
      token: this.jwtService.sign({ userId: user.id }),
    };
  }

  async getUserFromToken(token: string): Promise<User> {
    const decoded = this.jwtService.verify(token);
    return this.userService.findOne(decoded.userId);
  }
}
