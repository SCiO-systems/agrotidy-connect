import { HttpException, Injectable } from '@nestjs/common';
import { S3Service } from '../../../libraries/s3/s3.service';
import { QvantumService } from './qvantum.service';

@Injectable()
export class ToolsService {
	constructor(
		private readonly s3Service: S3Service,
		private readonly qvantumService: QvantumService
	) {}

	async transformCrop(key: string, model: string) {
		const dataPresigned = await this.s3Service.getPresigned(key);
		return await this.qvantumService.transformCrop(dataPresigned, model);
	}

	async cleanSurvey(type: string, s3Data: string, s3Form: string, s3Codebook: string) {
		if (type === 'simple') {
			const dataPresigned = await this.s3Service.getPresigned(s3Data);
			return await this.qvantumService.cleanSurveySimple(dataPresigned);
		}
		if (type === 'full') {
			const dataPresigned = await this.s3Service.getPresigned(s3Data);
			const formPresigned = await this.s3Service.getPresigned(s3Form);
			const codebookPresigned = await this.s3Service.getPresigned(s3Codebook);
			return await this.qvantumService.cleanSurveyFull(
				dataPresigned,
				formPresigned,
				codebookPresigned
			);
		}
		throw new HttpException('Bad input', 400);
	}
}
