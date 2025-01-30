import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';

@Module({
	imports: [
		// CacheModule.registerAsync({
		// 	imports: [ConfigModule],
		// 	useFactory: async (configService: ConfigService) => {
		// 		const store = await redisStore({
		// 			socket: {
		// 				host: configService.get<string>('REDIS_HOST'), // default value
		// 				port: parseInt(configService.get<string>('REDIS_PORT'), 10), // default value
		// 			},
		// 		});
		// 		return { store: store as unknown as CacheStore, ttl: 60 * 60 * 24 };
		// 	},
		// 	inject: [ConfigService],
		// }),
		CacheModule.register(),
	],
	controllers: [],
	providers: [CacheService],
	exports: [CacheService, CacheModule],
})
export class CacheModuleLib {}
