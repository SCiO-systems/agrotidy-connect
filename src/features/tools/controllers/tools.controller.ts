import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ToolsService } from '../domain/tools.service';
import { AuthorizationGuard } from '../../../libraries/auth0/auth0.guard';

@Controller('tools')
export class ToolsController {
	constructor(private readonly toolsService: ToolsService) {}

	@Post('crop')
	@UseGuards(AuthorizationGuard)
	async transformCrop(@Body('s3Key') key: string, @Body('model') model: string) {
		return await this.toolsService.transformCrop(key, model);
	}

	@Post('datacleaner/:type')
	@UseGuards(AuthorizationGuard)
	async cleanSurvey(
		@Body('s3DataKey') data: string,
		@Body('s3FormKey') form: string,
		@Body('s3CodebookKey') codebook: string,
		@Param('type') type: string
	) {
		return await this.toolsService.cleanSurvey(type, data, form, codebook);
	}
}
