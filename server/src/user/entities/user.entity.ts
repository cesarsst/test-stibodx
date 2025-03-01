import { ObjectType, Field, ID, Extensions } from "@nestjs/graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Roles } from "../../config/roles";
import { checkRoleMiddleware } from "../../middlewares/admin.middleware";

@ObjectType()
@Entity()
export class User {
  @Field(() => ID, { middleware: [checkRoleMiddleware] })
  @Extensions({ role: Roles.ADMIN })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: Roles.ADMIN })
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  role: Number;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
