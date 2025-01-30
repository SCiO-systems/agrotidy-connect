import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

function checkEnvironment(configService: ConfigService) {
	const requiredEnvVars = [
		'PORT',
		'ISSUER_BASE_URL',
		'AUDIENCE',
		'CLIENT_ORIGIN_URL',
		'MANAGEMENT_AUDIENCE',
		'CLIENT_ID',
		'CLIENT_SECRET',
		'S3_REGION',
		'S3_ACCESS_KEY_ID',
		'S3_SECRET_ACCESS_KEY',
		'S3_BUCKET',
	];

	requiredEnvVars.forEach((envVar) => {
		if (!configService.get<string>(envVar)) {
			throw Error(`Undefined environment variable: ${envVar}`);
		}
	});
}
async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	const configService = app.get<ConfigService>(ConfigService);
	checkEnvironment(configService);

	app.enableCors({
		origin: configService.get('CLIENT_ORIGIN_URL'),
		methods: ['GET', 'PUT', 'POST', 'PATCH'],
		allowedHeaders: ['Authorization', 'Content-Type'],
		maxAge: 86400,
	});

	app.useGlobalPipes(new ValidationPipe({ transform: true }));

	await app.listen(configService.get('PORT'));
}

bootstrap();
