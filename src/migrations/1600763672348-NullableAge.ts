import {MigrationInterface, QueryRunner} from "typeorm";

export class NullableAge1600763672348 implements MigrationInterface {
    name = 'NullableAge1600763672348'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "age" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "age" SET NOT NULL`);
    }

}
