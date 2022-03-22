import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
	@IsNotEmpty()
	readonly username: string;

	@IsNotEmpty()
	@IsEmail()
	readonly email: string;

	@IsString()
	readonly bio: string;

	@IsString()
	readonly image: string;
}
