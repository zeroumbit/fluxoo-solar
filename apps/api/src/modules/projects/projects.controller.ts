import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Query,
  Patch,
  UseGuards,
  Req,
  HttpCode
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('projects')
@UseGuards(PermissionsGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @Permissions('view:projects')
  async findAll(
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return await this.projectsService.findAll(status, search);
  }

  @Get('received')
  @Permissions('view:projects')
  async getReceivedProjects(
    @Req() req: any,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.projectsService.getReceivedByEngineering(activeTenantId, { status, search });
  }

  @Get('stats')
  @Permissions('view:projects')
  async getStats(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.projectsService.getEngineeringStats(activeTenantId);
  }

  @Get(':id')
  @Permissions('view:projects')
  async findOne(@Param('id') id: string) {
    return await this.projectsService.findOne(id);
  }

  @Post()
  @Permissions('create:projects')
  @HttpCode(201)
  async create(
    @Body() dto: CreateProjectDto,
    @Req() req: any
  ) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    const currentUserId = req.user?.id;

    return await this.projectsService.create(dto, activeTenantId, currentUserId);
  }

  @Patch(':id/delegate')
  @Permissions('manage:projects')
  async delegate(
    @Param('id') id: string,
    @Body() body: { delegatedTenantId: string },
    @Req() req: any
  ) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    const userRole = req.user?.app_metadata?.active_role;

    return await this.projectsService.delegateToEngineering(
      id,
      body.delegatedTenantId,
      activeTenantId,
      userRole
    );
  }
}
