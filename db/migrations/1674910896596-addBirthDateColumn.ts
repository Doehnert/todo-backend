import { MigrationInterface, QueryRunner } from "typeorm";

export class addBirthDateColumn1674910896596 implements MigrationInterface {
    name = 'addBirthDateColumn1674910896596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "birthDate" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "birthDate"`);
    }

}
