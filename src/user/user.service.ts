import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { sign } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { UserResponseInterface } from './types/userResponse.interface';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
		private configService: ConfigService,
	) {}

	async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
		const errorResponse = { errors: {} };

		const userByEmail = await this.userRepository.findOne({
			email: createUserDto.email,
		});
		const userByUsername = await this.userRepository.findOne({
			username: createUserDto.username,
		});

		if (userByEmail) {
			errorResponse.errors['email'] = ['Has already been taken'];
		}
		if (userByUsername) {
			errorResponse.errors['username'] = ['Has already been taken'];
		}

		if (userByEmail || userByUsername) {
			throw new HttpException(errorResponse, HttpStatus.UNPROCESSABLE_ENTITY);
		}

		const newUser = new UserEntity();
		Object.assign(newUser, createUserDto);
		return await this.userRepository.save(newUser);
	}

	generateJwt(user: UserEntity): string {
		return sign(
			{ id: user.id, username: user.username, email: user.email },
			this.configService.get('JWT_SECRET'),
		);
	}

	buildUserResponse(user: UserEntity): UserResponseInterface {
		return {
			user: {
				...user,
				token: this.generateJwt(user),
			},
		};
	}
}
