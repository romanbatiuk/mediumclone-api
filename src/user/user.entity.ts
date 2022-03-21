import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';

@Entity({ name: 'users' })
export class UserEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	username: string;

	@Column({ default: '' })
	bio: string;

	@Column()
	email: string;

	@Column({ nullable: true })
	image: string;

	@Column()
	password: string;

	@BeforeInsert()
	async hashPassword() {
		const salt = await genSalt(10);
		this.password = await hash(this.password, salt);
	}
}