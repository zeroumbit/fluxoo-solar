import { 
  Body, 
  Controller, 
  Get, 
  Post, 
  Param, 
  Patch, 
  Delete, 
  UseGuards, 
  Req 
} from '@nestjs/common';
import { TeamService } from './team.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('team')
@UseGuards(PermissionsGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('members')
  @Permissions('view:team')
  async listMembers(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.teamService.listMembers(activeTenantId);
  }

  @Post('invites')
  @Permissions('create:invites')
  async invite(@Body() dto: any, @Req() req: any) {
    const currentUserId = req.user?.id;
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    const activeRole = req.user?.app_metadata?.active_role;
    
    return await this.teamService.inviteMembro(dto.email, dto.role, currentUserId, activeTenantId, activeRole);
  }

  @Patch('members/:userId/role')
  @Permissions('manage:team')
  async updateRole(@Param('userId') targetId: string, @Body('role') newRole: string, @Req() req: any) {
     const activeTenantId = req.user?.app_metadata?.active_tenant_id;
     const activeRole = req.user?.app_metadata?.active_role;
     return await this.teamService.updateRole(targetId, newRole, activeTenantId, activeRole);
  }

  @Delete('members/:userId')
  @Permissions('manage:team')
  async removeMember(@Param('userId') targetId: string, @Req() req: any) {
     const activeTenantId = req.user?.app_metadata?.active_tenant_id;
     return await this.teamService.setMemberStatus(targetId, false, activeTenantId);
  }
}
