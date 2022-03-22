import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { UserService } from '../user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
	constructor(
		private readonly configService: ConfigService,
		private readonly userService: UserService,
	) {}
	async use(req: ExpressRequestInterface, res: Response, next: NextFunction) {
		// console.log(req.headers);
		if (!req.headers.authorization) {
			req.user = null;
			return;
		}

		const token = req.headers.authorization.split(' ')[1];
		try {
			const decoded: any = verify(token, this.configService.get('JWT_SECRET'));
			// console.log(decode);
			const user = await this.userService.findById(decoded.id);
			req.user = user;
			next();
		} catch (err) {
			console.log(err);
			req.user = null;
			next();
		}
	}
}
