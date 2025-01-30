import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Logger,
	Param,
	Post,
	Query,
	UseGuards,
} from '@nestjs/common';
import { S3Service } from '../../../libraries/s3/s3.service';
import { FileIdDto } from '../data/dto/file-id.dto';
import { SignPartDto } from '../data/dto/sign-part.dto';
import { AuthorizationGuard } from '../../../libraries/auth0/auth0.guard';

@Controller('uppy')
export class UppyController {
	private readonly logger = new Logger(UppyController.name);

	constructor(private readonly s3Service: S3Service) {}

	private sanitizeS3FileName = (fileName) => {
		// // Get the current timestamp in YYYYMMDD_HHMMSS format
		// const timestamp = new Date().toISOString().replace(/[-:T]/g, '').split('.')[0];

		// Define a regex pattern for unsafe characters
		const unsafeChars = /[^a-zA-Z0-9._-]/g;

		// Replace unsafe characters with an underscore
		let sanitized = fileName.replace(unsafeChars, '_');

		// Ensure there are no consecutive underscores
		sanitized = sanitized.replace(/_+/g, '_');

		// Trim leading or trailing underscores
		sanitized = sanitized.replace(/^_+|_+$/g, '');

		// Add the timestamp at the beginning of the file name
		return sanitized;
	};

	@Post('s3')
	@HttpCode(200)
	@UseGuards(AuthorizationGuard)
	async getUploadParameters(@Body('fileKey') key: string) {
		const sanitizedKey = this.sanitizeS3FileName(key);
		const url = await this.s3Service.putPresigned(sanitizedKey);
		this.logger.log('Presigned PUT url generated: ', url);
		return { method: 'PUT', url };
	}

	@Post('s3-multipart')
	@UseGuards(AuthorizationGuard)
	async initiateMultipartUpload(@Body('fileKey') key: string) {
		const sanitizedKey = this.sanitizeS3FileName(key);
		const response = await this.s3Service.initiateMultipartUpload(sanitizedKey);
		return { uploadId: response.UploadId, fileKey: sanitizedKey };
	}

	@Post('s3-multipart/:id/complete')
	@UseGuards(AuthorizationGuard)
	async completeMultipartUpload(@Param() params: FileIdDto, @Query('fileKey') key: string) {
		return await this.s3Service.completeMultipartUpload(key, params.id);
	}

	@Delete('s3-multipart/:id/abort')
	@UseGuards(AuthorizationGuard)
	async abortMultipartUpload(@Param() params: FileIdDto, @Query('fileKey') key: string) {
		return await this.s3Service.abortMultipartUpload(key, params.id);
	}

	@Get('s3-multipart/:id')
	@UseGuards(AuthorizationGuard)
	async getUploadedParts(@Param() params: FileIdDto, @Query('fileKey') key: string) {
		const response = await this.s3Service.listParts(key, params.id);
		return response.Parts;
	}

	@Get('s3-multipart/:id/:part')
	@UseGuards(AuthorizationGuard)
	async getPartPresignedUrl(@Param() params: SignPartDto, @Query('fileKey') key: string) {
		const url = await this.s3Service.uploadPartPresigned(key, params.part, params.id);
		return { url };
	}
	//
	// @Get('s3/complete')
	// async completeUpload(@Query('fileKey') key: string) {}
}
