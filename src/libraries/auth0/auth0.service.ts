import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

type Auth0Token = {
	access_token: string;
	token_type: string;
	expires_in: number;
};

@Injectable()
export class Auth0Service {
	constructor(
		private readonly httpService: HttpService,
		private configService: ConfigService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache
	) {}

	private readonly logger = new Logger(Auth0Service.name);

	async getNodeApiToken(): Promise<string> {
		const value = (await this.cacheManager.get('auth0')) as string;
		if (value) {
			return value;
		}

		const token = await this.fetchToken();
		await this.cacheManager.set('auth0', token.access_token, token.expires_in);

		return token.access_token;
	}

	private async fetchToken(): Promise<Auth0Token> {
		try {
			const url = `${this.configService.get<string>('ISSUER_BASE_URL')}/oauth/token`;
			const observable = this.httpService
				.post<Auth0Token>(
					url,
					{
						client_id: this.configService.get('CLIENT_ID'),
						client_secret: this.configService.get('CLIENT_SECRET'),
						audience: this.configService.get('AUDIENCE'),
						grant_type: 'client_credentials',
					},
					{
						headers: { 'Content-Type': 'application/json' },
					}
				)
				.pipe(
					catchError((error: AxiosError) => {
						this.logger.error(error.message);
						return throwError(
							() => new HttpException(error.message, HttpStatus.BAD_REQUEST)
						);
					}),
					map((response) => response.data)
				);

			return await lastValueFrom(observable);
		} catch (e) {
			throw new HttpException(e.message, 400);
		}
	}
}
