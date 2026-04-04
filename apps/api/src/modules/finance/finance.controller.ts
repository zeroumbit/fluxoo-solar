import { 
  Controller, 
  Get, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { FinanceService } from './finance.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('finance')
@UseGuards(PermissionsGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Get('summary')
  @Permissions('view:finance')
  async getSummary(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    const activeRole = req.user?.app_metadata?.active_role;
    
    return await this.financeService.getSummary(activeTenantId, activeRole);
  }

  @Get('engineering')
  @Permissions('view:finance')
  async getEngineering(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.financeService.getEngineeringSummary(activeTenantId);
  }
}
