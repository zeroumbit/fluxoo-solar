import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('projects/:id/messages')
@UseGuards(PermissionsGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  @Permissions('view:projects')
  async findByProject(@Param('id') projectId: string, @Req() req: any) {
    const activeTenantType = req.user?.app_metadata?.active_tenant_type;
    return await this.messagesService.findByProject(projectId, activeTenantType);
  }

  @Post()
  @Permissions('create:projects') // Ou role mais especifica de mensageria
  async createMessage(@Param('id') projectId: string, @Body() dto: any, @Req() req: any) {
    const currentUserId = req.user?.id;
    const activeRole = req.user?.app_metadata?.active_role;
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    
    return await this.messagesService.createMessage(projectId, dto, currentUserId, activeRole, activeTenantId);
  }
}
