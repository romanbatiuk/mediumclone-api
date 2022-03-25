import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { ArticleEntity } from '@app/article/article.entity';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	username: string;

	@Column({ default: '' })
	bio: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	image: string;

	@Column({ select: false })
	password: string;

	@BeforeInsert()
	async hashPassword() {
		const salt = await genSalt(10);
		this.password = await hash(this.password, salt);
	}

	@OneToMany(() => ArticleEntity, (article) => article.author)
	articles: ArticleEntity[];
}
