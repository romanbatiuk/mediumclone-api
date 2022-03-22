import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Body, Controller, Get, Post, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { Request } from 'express';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponseInterface } from './types/userResponse.interface';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post('users')
	@UsePipes(new ValidationPipe())
	async createUser(@Body('user') createUserDto: CreateUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.createUser(createUserDto);
		return this.userService.buildUserResponse(user);
	}

	@Post('users/login')
	@UsePipes(new ValidationPipe())
	async loginUser(@Body('user') loginUserDto: LoginUserDto): Promise<UserResponseInterface> {
		const user = await this.userService.loginUser(loginUserDto);
		return this.userService.buildUserResponse(user);
	}

	@Get('user')
	async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user);
	}
}
