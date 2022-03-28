import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'follows' })
export class FollowEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	// id current user
	@Column()
	followerId: string;

	// id profile or user which we follow
	@Column()
	followingId: string;
}
