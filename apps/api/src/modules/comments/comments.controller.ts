import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('projects/:id/checklist/:itemId/comments')
@UseGuards(PermissionsGuard)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  @Permissions('view:projects')
  async findByItem(@Param('itemId') itemId: string, @Req() req: any) {
    const hasTenant = !!req.user?.app_metadata?.active_tenant_id;
    return await this.commentsService.findByChecklistItem(itemId, hasTenant);
  }

  @Post()
  @Permissions('create:projects')
  async createComment(@Param('itemId') itemId: string, @Body() dto: any, @Req() req: any) {
    const currentUserId = req.user?.id;
    const hasTenant = !!req.user?.app_metadata?.active_tenant_id;
    
    return await this.commentsService.createComment(itemId, dto, currentUserId, hasTenant);
  }
}
