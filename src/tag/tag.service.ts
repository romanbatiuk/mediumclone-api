import { Injectable } from '@nestjs/common';

@Injectable()
export class TagService {
	async findAll(): Promise<string[]> {
		return ['reactjs', 'nextjs', 'nodejs'];
	}
}
