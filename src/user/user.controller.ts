import {
	Body,
	Controller,
	Get,
	Post,
	Put,
	UseGuards,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common';
import { User } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from './guards/auth.guard';
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
	@UseGuards(AuthGuard)
	async getCurrentUser(@User() user: UserEntity): Promise<UserResponseInterface> {
		return this.userService.buildUserResponse(user);
	}

	@Put('user')
	@UseGuards(AuthGuard)
	async UpdateCurrentUser(
		@Body('user') updateUserDto: UpdateUserDto,
		@User('id') currentUserId: string,
	): Promise<UserResponseInterface> {
		const userUpdated = await this.userService.updateUser(currentUserId, updateUserDto);
		return this.userService.buildUserResponse(userUpdated);
	}
}
