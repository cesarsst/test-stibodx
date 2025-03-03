import { getRepository } from "typeorm";
import { User } from "../user/entities/user.entity";
import * as bcrypt from "bcryptjs";

async function createUser() {
  const userRepository = getRepository(User);
  const user = new User();
  user.firstName = "John";
  user.lastName = "Doe";
  user.email = "admin@admin.com";
  user.password = await bcrypt.hash("admin1234", 10);
  user.role = 0;
  user.createdAt = new Date();
  user.updatedAt = new Date();

  await userRepository.save(user);
  console.log("User created successfully");
}

createUser().catch((error) => console.error("Error creating user:", error));
