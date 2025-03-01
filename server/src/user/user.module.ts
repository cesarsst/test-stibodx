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

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: "yourSecretKey", // replace with your secret key
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [
    UserService,
    AuthService,
    AdminGuard,
    AuthGuard,
    JwtService,
    UserResolver,
  ],
  exports: [UserService],
})
export class UserModule {}
