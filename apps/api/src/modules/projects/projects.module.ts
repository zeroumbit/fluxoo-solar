import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { ProjectStatusPolicyService } from './project-status-policy.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [ProjectsController],
  providers: [ProjectsService, ProjectStatusPolicyService],
  exports: [ProjectsService, ProjectStatusPolicyService],
})
export class ProjectsModule {}
