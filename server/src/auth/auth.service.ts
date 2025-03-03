import { Injectable } from "@nestjs/common";
import { AuthResponse } from "./dto/auth-response";
import { UserService } from "../user/user.service";
import { AuthRequest } from "./dto/auth-request";
import { JwtService } from "@nestjs/jwt";
import { User } from "src/user/entities/user.entity";
import { BadRequestException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  // Add your methods and logic here
  async login(authInput: AuthRequest): Promise<AuthResponse> {
    const user = await this.userService.findOneByEmail(authInput.email);
    if (!user) {
      throw new BadRequestException("Invalid credentials");
    }
    const isPasswordValid = await bcrypt.compare(
      authInput.password,
      user.password
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
