import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsers1647887864907 implements MigrationInterface {
	name = 'CreateUsers1647887864907';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "bio" character varying NOT NULL DEFAULT '', "email" character varying NOT NULL, "image" character varying, "password" character varying NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "users"`);
	}
}
