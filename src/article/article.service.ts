import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/ArticleResponseInterface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<ArticleEntity>,
	) {}

	async createArticle(
		currentUser: UserEntity,
		createArticleDto: CreateArticleDto,
	): Promise<ArticleEntity> {
		const article = new ArticleEntity();
		Object.assign(article, createArticleDto);

		if (!article.tagList) {
			article.tagList = [];
		}

		article.slug = ArticleService.getSlug(createArticleDto.title);
		article.author = currentUser;

		return await this.articleRepository.save(article);
	}

	async findByAlias(slug: string): Promise<ArticleEntity> {
		const article = await this.articleRepository.findOne({ slug });
		if (!article) {
			throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
		}
		return article;
	}

	async deleteArticle(slug: string, userId: string): Promise<DeleteResult> {
		const article = await this.findByAlias(slug);

		if (article.author.id !== userId) {
			throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
		}

		return await this.articleRepository.delete({ slug });
	}

	buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
		return { article };
	}

	private static getSlug(title: string): string {
		return (
			slugify(title, { lower: true }) + '-' + ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		);
	}
}
