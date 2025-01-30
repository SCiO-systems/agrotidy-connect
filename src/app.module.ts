import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UppyModule } from './features/uppy-s3/uppy.module';
import { ToolsModule } from './features/tools/tools.module';

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), UppyModule, ToolsModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
