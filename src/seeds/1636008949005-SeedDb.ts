import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1636008949005 implements MigrationInterface {
	name = 'SeedDb1636008949005';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`);

		// password is 123456
		await queryRunner.query(
			`INSERT INTO users (id, username, email, password) VALUES ('40c6e24e-add5-407c-9a35-1f77a065a6f2', 'admin', 'admin@mail.com', '$2b$10$6cGln8nfdaJlGsdoFJdDyOa9uHLp7/Hx.N871FyyuqqxR38LiiEdK')`,
		);

		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First article', 'First article description', 'First article body', 'dragons,coffee', '40c6e24e-add5-407c-9a35-1f77a065a6f2')`,
		);
		await queryRunner.query(
			`INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('second-article', 'Second article', 'Second article description', 'Second article body', 'nestjs,coffee', '40c6e24e-add5-407c-9a35-1f77a065a6f2')`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "tags"`);
	}
}
