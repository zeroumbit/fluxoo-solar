import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('offline')
  async sync(@Body() dto: any, @Req() req: any) {
    const userId = req.user?.id;
    const tenantId = req.user?.app_metadata?.active_tenant_id;
    
    return await this.syncService.processBatch(userId, tenantId, dto.operations);
  }
}
