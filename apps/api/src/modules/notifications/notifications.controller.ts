import { 
  Controller, 
  Get, 
  Patch, 
  Param, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('notifications')
@UseGuards(PermissionsGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Permissions('view:projects') // Ou role genérica de leitura
  async findAll(@Req() req: any) {
    const userId = req.user?.id;
    return await this.notificationsService.findAll(userId);
  }

  @Patch(':id/read')
  @Permissions('view:projects')
  async read(@Param('id') id: string, @Req() req: any) {
    const userId = req.user?.id;
    return await this.notificationsService.markAsRead(id, userId);
  }

  @Patch('read-all')
  @Permissions('view:projects')
  async readAll(@Req() req: any) {
    const userId = req.user?.id;
    return await this.notificationsService.markAllAsRead(userId);
  }
}
