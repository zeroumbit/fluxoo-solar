import { Body, Controller, Get, Post, Param, UseGuards, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { PermissionsGuard } from '../rbac/permissions.guard';
import { Permissions } from '../rbac/permissions.decorator';

@Controller('reviews')
@UseGuards(PermissionsGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @Permissions('view:reviews')
  async getReviews(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.reviewsService.getReviews(activeTenantId);
  }

  @Get('average')
  @Permissions('view:reviews')
  async getAverageRating(@Req() req: any) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.reviewsService.getAverageRating(activeTenantId);
  }

  @Post(':id/respond')
  @Permissions('manage:reviews')
  async respondReview(
    @Param('id') id: string,
    @Body('response') response: string,
    @Req() req: any
  ) {
    const activeTenantId = req.user?.app_metadata?.active_tenant_id;
    return await this.reviewsService.respondReview(id, response, activeTenantId);
  }
}
