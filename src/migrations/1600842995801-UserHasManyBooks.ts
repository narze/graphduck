import {MigrationInterface, QueryRunner} from "typeorm";

export class UserHasManyBooks1600842995801 implements MigrationInterface {
    name = 'UserHasManyBooks1600842995801'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" ADD "ownerId" integer`);
        await queryRunner.query(`ALTER TABLE "book" ADD CONSTRAINT "FK_b90677e3d515d915033134fc5f4" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "book" DROP CONSTRAINT "FK_b90677e3d515d915033134fc5f4"`);
        await queryRunner.query(`ALTER TABLE "book" DROP COLUMN "ownerId"`);
    }

}
