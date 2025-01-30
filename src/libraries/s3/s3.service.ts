import { Injectable, Logger } from '@nestjs/common';
import {
	S3Client,
	PutObjectCommand,
	CreateMultipartUploadCommand,
	ListPartsCommand,
	PutObjectCommandOutput,
	CreateMultipartUploadCommandOutput,
	ListPartsCommandOutput,
	UploadPartCommand,
	CompleteMultipartUploadCommand,
	CompleteMultipartUploadCommandOutput,
	AbortMultipartUploadCommand,
	AbortMultipartUploadCommandOutput,
	GetObjectCommand,
	ServiceOutputTypes,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
	private readonly s3Client: S3Client;

	private readonly logger = new Logger(S3Service.name);

	constructor(private configService: ConfigService) {
		this.s3Client = new S3Client({
			region: configService.get<string>('S3_REGION'),
			credentials: {
				accessKeyId: configService.get<string>('S3_ACCESS_KEY_ID'),
				secretAccessKey: configService.get<string>('S3_SECRET_ACCESS_KEY'),
			},
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async getPresignedUrl(command: any, commandName: string): Promise<string> {
		try {
			const data = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
			this.logger.log(`${commandName} presigned success: `, data);
			return data;
		} catch (e) {
			this.logger.error(`${commandName} presigned error: `, e);
			throw e;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async sendCommand(command: any, commandName: string): Promise<ServiceOutputTypes> {
		try {
			const data = await this.s3Client.send(command);
			this.logger.log(`${commandName} successful`, data);
			return data;
		} catch (e) {
			this.logger.error(`${commandName} error: `, e);
			throw e;
		}
	}

	async put(key: string): Promise<PutObjectCommandOutput> {
		const command = new PutObjectCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
		});
		return (await this.sendCommand(command, 'PutObjectCommand')) as PutObjectCommandOutput;
	}

	async putPresigned(key: string): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
		});
		return await this.getPresignedUrl(command, 'PutObjectCommand');
	}

	// async get(key: string) {
	// 	const command = new GetObjectCommand({
	// 		Bucket: this.configService.get<string>('S3_BUCKET'),
	// 		Key: key,
	// 	});
	// 	const response = (await this.sendCommand(
	// 		command,
	// 		'GetObjectCommand'
	// 	)) as GetObjectCommandOutput;
	// }

	async getPresigned(key: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
		});
		return await this.getPresignedUrl(command, 'GetObjectCommand');
	}

	async initiateMultipartUpload(key: string): Promise<CreateMultipartUploadCommandOutput> {
		const command = new CreateMultipartUploadCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
		});
		return (await this.sendCommand(
			command,
			'CreateMultipartUploadCommand'
		)) as CreateMultipartUploadCommandOutput;
	}

	async listParts(key: string, uploadId: string): Promise<ListPartsCommandOutput> {
		const command = new ListPartsCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
			UploadId: uploadId,
		});
		return (await this.sendCommand(command, 'ListPartsCommand')) as ListPartsCommandOutput;
	}

	async uploadPartPresigned(key: string, part: number, uploadId: string): Promise<string> {
		const command = new UploadPartCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
			UploadId: uploadId,
			PartNumber: part,
		});
		return await this.getPresignedUrl(command, 'UploadPartCommand');
	}

	async completeMultipartUpload(
		key: string,
		uploadId: string
	): Promise<CompleteMultipartUploadCommandOutput> {
		const partsCommandOutput = await this.listParts(key, uploadId);
		const command = new CompleteMultipartUploadCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
			UploadId: uploadId,
			MultipartUpload: {
				Parts: partsCommandOutput.Parts,
			},
		});
		return (await this.sendCommand(
			command,
			'CompleteMultipartUploadCommand'
		)) as CompleteMultipartUploadCommandOutput;
	}

	async abortMultipartUpload(
		key: string,
		uploadId: string
	): Promise<AbortMultipartUploadCommandOutput> {
		const command = new AbortMultipartUploadCommand({
			Bucket: this.configService.get<string>('S3_BUCKET'),
			Key: key,
			UploadId: uploadId,
		});
		return (await this.sendCommand(
			command,
			'AbortMultipartUploadCommand'
		)) as AbortMultipartUploadCommandOutput;
	}
}
