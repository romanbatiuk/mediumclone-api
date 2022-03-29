import { User } from '@app/user/decorators/user.decorator';
import { AuthGuard } from '@app/user/guards/auth.guard';
import { UserEntity } from '@app/user/user.entity';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-artilce.dto';
import { ArticleResponseInterface } from './types/ArticleResponseInterface';
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface';

@Controller('articles')
export class ArticleController {
	constructor(private readonly articleService: ArticleService) {}

	@Get()
	async findAll(
		@User('id') currentUserId: string,
		@Query() query: any,
	): Promise<ArticlesResponseInterface> {
		return await this.articleService.findAll(currentUserId, query);
	}

	@Get('feed')
	@UseGuards(AuthGuard)
	async getFeed(
		@User('id') currentUserId: string,
		@Query() query: any,
	): Promise<ArticlesResponseInterface> {
		return await this.articleService.getFeed(currentUserId, query);
	}

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

	@Put(':slug')
	@UseGuards(AuthGuard)
	async updateArticleByAlias(
		@User('id') currentUserId: string,
		@Param('slug') slug: string,
		@Body('article') updateArticleDto: UpdateArticleDto,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.updateArticleByAlias(
			slug,
			updateArticleDto,
			currentUserId,
		);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug')
	@UseGuards(AuthGuard)
	async deleteByAlias(@User('id') currentUserId: string, @Param('slug') slug: string) {
		return await this.articleService.deleteArticle(slug, currentUserId);
	}

	@Post(':slug/favorite')
	@UseGuards(AuthGuard)
	async addArticleToFavorites(
		@User('id') currentUserId: string,
		@Param('slug') slug: string,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.addArticleToFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(article);
	}

	@Delete(':slug/favorite')
	@UseGuards(AuthGuard)
	async deleteArticleFromFavorites(
		@User('id') currentUserId: string,
		@Param('slug') slug: string,
	): Promise<ArticleResponseInterface> {
		const article = await this.articleService.deleteArticleFromFavorites(slug, currentUserId);
		return this.articleService.buildArticleResponse(article);
	}
}
