import { ExpressRequestInterface } from '@app/types/expressRequest.interface';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean | Promise<boolean> {
		const request = context.switchToHttp().getRequest<ExpressRequestInterface>();

		if (request.user) {
			return true;
		}

		throw new UnauthorizedException();
	}
}
