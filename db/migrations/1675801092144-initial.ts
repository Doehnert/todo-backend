import { MigrationInterface, QueryRunner } from 'typeorm';

export class initial1675801092144 implements MigrationInterface {
  name = 'initial1675801092144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "histories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "task" character varying, "isTranslated" boolean NOT NULL DEFAULT false, "is_done" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "todoId" uuid, CONSTRAINT "PK_36b0e707452a8b674f9d95da743" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "task" character varying NOT NULL, "is_done" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "userId" uuid, CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_roles_enum" AS ENUM('user', 'admin')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "birthDate" date, "email" character varying NOT NULL, "password" character varying NOT NULL, "roles" "public"."user_roles_enum" NOT NULL DEFAULT 'user', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "histories" ADD CONSTRAINT "FK_347a20da9419c0c6707f7021601" FOREIGN KEY ("todoId") REFERENCES "todos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "FK_4583be7753873b4ead956f040e3" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todos" DROP CONSTRAINT "FK_4583be7753873b4ead956f040e3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "histories" DROP CONSTRAINT "FK_347a20da9419c0c6707f7021601"`,
    );
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_roles_enum"`);
    await queryRunner.query(`DROP TABLE "todos"`);
    await queryRunner.query(`DROP TABLE "histories"`);
  }
}
