import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "./src/user/user.module";
import { join } from "path";
import { AppDataSource } from "./data-source";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), "src/schema.gql"),
      playground: true,
    }),
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
      autoLoadEntities: true,
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
