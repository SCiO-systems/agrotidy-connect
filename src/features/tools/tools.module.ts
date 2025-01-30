import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ToolsController } from './controllers/tools.controller';
import { ToolsService } from './domain/tools.service';
import { QvantumService } from './domain/qvantum.service';
import { Auth0Service } from '../../libraries/auth0/auth0.service';
import { S3Module } from '../../libraries/s3/s3.module';
import { CacheModuleLib } from '../../libraries/cache/cache.module.lib';

@Module({
	imports: [HttpModule, S3Module, CacheModuleLib],
	controllers: [ToolsController],
	providers: [ToolsService, QvantumService, Auth0Service],
})
export class ToolsModule {}
