import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameUserToAuthor1600943625486 implements MigrationInterface {
    name = 'RenameUserToAuthor1600943625486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("user", "author")
        await queryRunner.query(`ALTER SEQUENCE "user_id_seq" RENAME TO "author_id_seq"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("author", "user")
        await queryRunner.query(`ALTER SEQUENCE "author_id_seq" RENAME TO "user_id_seq"`);
    }

}
