import { UserEntity } from '@app/user/user.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getRepository, Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { ArticleResponseInterface } from './types/ArticleResponseInterface';
import slugify from 'slugify';
import { UpdateArticleDto } from './dto/update-artilce.dto';
import { ArticlesResponseInterface } from './types/ArticlesResponseInterface';

@Injectable()
export class ArticleService {
	constructor(
		@InjectRepository(ArticleEntity)
		private readonly articleRepository: Repository<ArticleEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	async findAll(userId: string, query: any): Promise<ArticlesResponseInterface> {
		const queryBuilder = getRepository(ArticleEntity)
			.createQueryBuilder('articles')
			.leftJoinAndSelect('articles.author', 'author');

		queryBuilder.orderBy('articles.createdAt', 'DESC');

		const articlesCount = await queryBuilder.getCount();

		if (query.tag) {
			queryBuilder.andWhere('articles.tagList LIKE :tag', {
				tag: `%${query.tag}%`,
			});
		}

		if (query.author) {
			const author = await this.userRepository.findOne({
				username: query.author,
			});

			if (!author) {
				throw new HttpException('Author username not found!', HttpStatus.NOT_FOUND);
			}
			queryBuilder.andWhere('articles.authorId = :id', {
				id: author.id,
			});
		}

		if (query.favorited) {
			const author = await this.userRepository.findOne(
				{ username: query.favorited },
				{ relations: ['favorites'] },
			);
			const ids = author.favorites.map((el) => el.id);

			if (ids.length > 0) {
				queryBuilder.andWhere('articles.id IN (:...ids)', { ids });
			} else {
				queryBuilder.andWhere('1 = 0');
			}
		}

		if (query.limit) {
			queryBuilder.limit(query.limit);
		}

		if (query.offset) {
			queryBuilder.limit(query.offset);
		}

		let favoriteIds: string[] = [];

		if (userId) {
			const currentUser = await this.userRepository.findOne(userId, { relations: ['favorites'] });
			favoriteIds = currentUser.favorites.map((favorite) => favorite.id);
		}

		const articles = await queryBuilder.getMany();
		const articlesWithFavorites = articles.map((article) => {
			const favorited = favoriteIds.includes(article.id);

			return { ...article, favorited };
		});

		return { articles: articlesWithFavorites, articlesCount };
	}

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

	async updateArticleByAlias(
		slug: string,
		updateArticleDto: UpdateArticleDto,
		userId: string,
	): Promise<ArticleEntity> {
		const article = await this.findByAlias(slug);

		if (article.author.id !== userId) {
			throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
		}

		article.slug = ArticleService.getSlug(updateArticleDto.title);

		Object.assign(article, updateArticleDto);
		return await this.articleRepository.save(article);
	}

	async deleteArticle(slug: string, userId: string): Promise<DeleteResult> {
		const article = await this.findByAlias(slug);

		if (article.author.id !== userId) {
			throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
		}

		return await this.articleRepository.delete({ slug });
	}

	async addArticleToFavorites(slug: string, userId: string): Promise<ArticleEntity> {
		const article = await this.findByAlias(slug);
		const user = await this.userRepository.findOne(userId, {
			relations: ['favorites'],
		});

		const isNotFavorited =
			user.favorites.findIndex((articleInFavorites) => articleInFavorites.id === article.id) === -1;

		if (isNotFavorited) {
			user.favorites.push(article);
			article.favoritesCount++;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}

		return article;
	}

	async deleteArticleFromFavorites(slug: string, userId: string): Promise<ArticleEntity> {
		const article = await this.findByAlias(slug);
		const user = await this.userRepository.findOne(userId, {
			relations: ['favorites'],
		});

		const articleIndex = user.favorites.findIndex(
			(articleInFavorites) => articleInFavorites.id === article.id,
		); // -1 || index in array

		if (articleIndex >= 0) {
			user.favorites.splice(articleIndex, 1);
			article.favoritesCount--;
			await this.userRepository.save(user);
			await this.articleRepository.save(article);
		}

		return article;
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
