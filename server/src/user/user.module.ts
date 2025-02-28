import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AdminGuard } from "../guards/admin.guard";
import { JwtModule } from "@nestjs/jwt";
import { JwtService } from "@nestjs/jwt";
import { UserResolver } from "./user.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: "yourSecretKey", // replace with your secret key
      signOptions: { expiresIn: "60s" },
    }),
  ],
  providers: [UserService, AdminGuard, JwtService, UserResolver],
})
export class UserModule {}
