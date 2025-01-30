import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
	public readonly logger = new Logger(CacheService.name);

	constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

	public makeKey(inputString: string): string {
		return inputString;
	}

	public async isKey(query: string): Promise<boolean> {
		const hashedQuery = this.makeKey(query);

		try {
			return !!(await this.cacheManager.get(hashedQuery));
		} catch {
			throw Error('Error getting query from cache.');
		}
	}

	public async getKey<T>(query: string): Promise<T> {
		const hashedQuery = this.makeKey(query);

		try {
			this.logger.log(`Getting hashed query value: ${hashedQuery}`);
			return JSON.parse(await this.cacheManager.get(hashedQuery)) as T;
		} catch {
			throw Error('Error getting query from cache.');
		}
	}

	public async setKey(query: string, value: unknown, expiration?: number) {
		const hashedQuery = this.makeKey(query);
		const stringResult = JSON.stringify(value);
		try {
			this.logger.log(`Saving value at key: ${hashedQuery}`);
			await this.cacheManager.set(hashedQuery, stringResult, expiration || 0);
		} catch (e) {
			throw Error('Error writing query to cache.');
		}
	}
}
