import { typeOrmModuleOptions } from './typeorm.config';

const OrmConfigSeed = {
	...typeOrmModuleOptions,
	migrations: [__dirname + '/../seeds/**/*{.ts,.js}'],
	cli: {
		migrationsDir: 'src/seeds',
	},
};
export default OrmConfigSeed;
