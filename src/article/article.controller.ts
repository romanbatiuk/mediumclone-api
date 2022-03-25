import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/ArticleResponseInterface';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Post()
	@UseGuards(AuthGuard)
	async create(
		@User() currentUser: UserEntity,
		@Body('article') createArticleDto: CreateArticleDto,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.createArticle(currentUser, createArticleDto);
		return this.articleService.buildArticleResponse(article);
	}

	@Get(':slug')
	async findByAlias(@Param('slug') slug: string): Promise<ArticleResponseInterface> {
		const article = await this.articleService.findByAlias(slug);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteByAlias(@User('id') currentUserId: string, @Param('slug') slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}
}
