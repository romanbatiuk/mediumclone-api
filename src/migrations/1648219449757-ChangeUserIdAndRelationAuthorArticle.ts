import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeUserIdAndRelationAuthorArticle1648219449757 implements MigrationInterface {
	name = 'ChangeUserIdAndRelationAuthorArticle1648219449757';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`,
		);
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
		);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "authorId"`);
		await queryRunner.query(`ALTER TABLE "articles" ADD "authorId" uuid`);
		await queryRunner.query(
			`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`,
		);
		await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "authorId"`);
		await queryRunner.query(`ALTER TABLE "articles" ADD "authorId" integer`);
		await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433"`);
		await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "id"`);
		await queryRunner.query(`ALTER TABLE "users" ADD "id" SERIAL NOT NULL`);
		await queryRunner.query(
			`ALTER TABLE "users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")`,
		);
		await queryRunner.query(
			`ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		);
	}
}
