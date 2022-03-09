import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getPstgresOrmConfig = async (
	configService: ConfigService,
): Promise<TypeOrmModuleOptions> => ({
	type: 'postgres',
	host: configService.get('POSTGRES_HOST'),
	port: configService.get('POSTGRES_PORT'),
	username: configService.get('POSTGRES_USER'),
	password: configService.get('POSTGRES_PASSWORD'),
	database: configService.get('POSTGRES_DB'),
});