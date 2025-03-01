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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.register({
      secret: "yourSecretKey", // ideally use config service instead of hardcoding keys
      signOptions: { expiresIn: "1h" },
    }),
    UserModule, // Ensure UserModule is imported here
  ],
  providers: [AuthResolver, AuthService, AuthGuard, JwtService, UserService],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
