import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Param, 
  Query, 
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
    // JWT extraido pela lib de auth do Supabase (configurado em hooks globais)
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    const currentUserId = req.user?.id;
    
    return await this.projectsService.create(dto, activeTenantId, currentUserId);
  }
}
