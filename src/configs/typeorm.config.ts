import { TypeOrmModuleOptions } from '@nestjs/typeorm';
require('dotenv').config();

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(<string>process.env.POSTGRES_PORT),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	entities: [__dirname + '/../**/*.entity.ts'],
	/* Note : it is unsafe to use synchronize: true for schema synchronization
    on production once you get data in your database. */
	synchronize: false,
	// autoLoadEntities: true,
};

export const OrmConfig = {
	...typeOrmModuleOptions,
	// migrationsTableName: 'migrations',
	migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/migrations',
	},
};
export default OrmConfig;
