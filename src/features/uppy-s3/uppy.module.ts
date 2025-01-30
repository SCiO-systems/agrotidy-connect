import { Module } from '@nestjs/common';
import { S3Module } from '../../libraries/s3/s3.module';
import { UppyController } from './controllers/uppy.controller';

@Module({
	imports: [S3Module],
	controllers: [UppyController],
})
export class UppyModule {}
