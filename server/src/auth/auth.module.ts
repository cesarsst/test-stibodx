import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthGuard } from "../guards/auth.guard";
import { AuthService } from "./auth.service";
import { UserModule } from "../user/user.module";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/user/user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { AuthResolver } from "src/auth/auth.resolver";
import * as dotenv from "dotenv";
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? "secret", // replace with your secret key
      signOptions: { expiresIn: "1h" },
    }),
    UserModule, // Ensure UserModule is imported here
  ],
  providers: [AuthResolver, AuthService, AuthGuard, UserService],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
