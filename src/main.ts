if (!process.env.IS_TS_NODE) {
	require('module-alias/register');
}

// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BackendValidationPipe } from './pipes/backendValidation.pipe';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.enableCors();
	// app.useGlobalPipes(new ValidationPipe());
	app.useGlobalPipes(new BackendValidationPipe());
	app.setGlobalPrefix('api');
	await app.listen(3000);
}
bootstrap();
