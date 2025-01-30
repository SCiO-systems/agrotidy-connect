import { HttpStatus, HttpException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, lastValueFrom, map, throwError } from 'rxjs';
import { AxiosError } from 'axios';
import { Auth0Service } from '../../../libraries/auth0/auth0.service';

@Injectable()
export class QvantumService {
	private readonly logger = new Logger(QvantumService.name);

	constructor(
		private readonly httpService: HttpService,
		private configService: ConfigService,
		private auth0Service: Auth0Service
	) {}

	async transformCrop(key: string, model: string) {
		try {
			const token = await this.auth0Service.getNodeApiToken();
			const url = `${this.configService.get<string>('QVANTUM_API')}/api/datapool/croptransform/${model}`;
			const observable = this.httpService
				.post<{
					download_link: string;
				}>(url, { link: key }, { headers: { Authorization: `Bearer ${token}` } })
				.pipe(
					catchError((error: AxiosError) => {
						this.logger.error(error.message);
						return throwError(
							() => new HttpException(error.message, HttpStatus.BAD_REQUEST)
						);
					}),
					map((response) => response)
				);

			const response = await lastValueFrom(observable);
			this.logger.log('Node Index response: ', response.status);
			return response.data.download_link;
		} catch (e) {
			this.logger.error(e.message);
			throw new HttpException(e.message, 400);
		}
	}

	async cleanSurveySimple(s3Data: string) {
		try {
			const token = await this.auth0Service.getNodeApiToken();
			const url = `${this.configService.get<string>('QVANTUM_API')}/api/datapool/allstata/simple/false`;
			const observable = this.httpService
				.post<{
					download_link: string;
				}>(url, { data: s3Data }, { headers: { Authorization: `Bearer ${token}` } })
				.pipe(
					catchError((error: AxiosError) => {
						this.logger.error(error.message);
						return throwError(
							() => new HttpException(error.message, HttpStatus.BAD_REQUEST)
						);
					}),
					map((response) => response)
				);

			const response = await lastValueFrom(observable);
			this.logger.log('Node Index response: ', response.status);
			return response.data.download_link;
		} catch (e) {
			this.logger.error(e.message);
			throw new HttpException(e.message, 400);
		}
	}

	async cleanSurveyFull(s3Data: string, s3Form: string, s3Codebook: string) {
		try {
			const token = await this.auth0Service.getNodeApiToken();
			const url = `${this.configService.get<string>('QVANTUM_API')}/api/datapool/allstata/full/false`;
			const observable = this.httpService
				.post<{
					download_link: string;
				}>(
					url,
					{ form: s3Form, data: s3Data, codebook: s3Codebook },
					{ headers: { Authorization: `Bearer ${token}` } }
				)
				.pipe(
					catchError((error: AxiosError) => {
						this.logger.error(error.message);
						return throwError(
							() => new HttpException(error.message, HttpStatus.BAD_REQUEST)
						);
					}),
					map((response) => response)
				);

			const response = await lastValueFrom(observable);
			this.logger.log('Node Index response: ', response.status);
			return response.data.download_link;
		} catch (e) {
			this.logger.error(e.message);
			throw new HttpException(e.message, 400);
		}
	}
}
