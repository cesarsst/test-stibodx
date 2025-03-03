import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from "bcryptjs";

export class SchemaUpdate1741029902680 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verifica se a tabela 'users' não existe e cria
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "role" integer NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_d234bbbfb5e36a3d24b4a70b4f3" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_b5aaf5a273e6de35c40edc42f4b" UNIQUE ("email")
      );
    `);

    // Verifica se já existe o usuário admin@admin.com
    const userExist = await queryRunner.query(`
      SELECT * FROM "user" WHERE "email" = 'admin@admin.com'
    `);

    if (userExist.length === 0) {
      // Se o usuário não existir, cria o usuário admin com senha criptografada
      const hashedPassword = await bcrypt.hash('admin123', 10);

      await queryRunner.query(`
        INSERT INTO "user" ("firstName", "lastName", "email", "password", "role", "createdAt", "updatedAt")
        VALUES ('Admin', 'User', 'admin@admin.com', '${hashedPassword}', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Caso precise reverter a migração, pode remover a tabela
    await queryRunner.query(`DROP TABLE IF EXISTS "user";`);
  }
}
