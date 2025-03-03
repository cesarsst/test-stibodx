import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AdminGuard } from "../guards/admin.guard";
import { AuthGuard } from "../guards/auth.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { UserResolver } from "./user.resolver";
import { AuthService } from "src/auth/auth.service";
import * as dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "secret", // replace with your secret key
      signOptions: { expiresIn: "1h" },
    }),
  ],
  providers: [UserService, AuthService, AdminGuard, AuthGuard, UserResolver],
  exports: [UserService],
})
export class UserModule {}
