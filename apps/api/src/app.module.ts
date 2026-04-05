import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { TerminusModule } from '@nestjs/terminus';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuperAdminGuard } from './common/guards/super-admin.guard';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ChecklistModule } from './modules/checklist/checklist.module';
import { StorageModule } from './modules/storage/storage.module';
import { MessagesModule } from './modules/messages/messages.module';
import { CommentsModule } from './modules/comments/comments.module';
import { TeamModule } from './modules/team/team.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { FinanceModule } from './modules/finance/finance.module';
import { SyncModule } from './modules/sync/sync.module';
import { PlansModule } from './modules/plans/plans.module';
import { HealthController } from './app-health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Rate Limiting (Hardening - Regra 6)
    ThrottlerModule.forRoot([{
        ttl: 60000,
        limit: 100, // 100 reqs por minuto por IP
    }]),
    TerminusModule, // Health Checks (Observabilidade - Regra 3)
    SupabaseModule,
    OnboardingModule,
    ProjectsModule,
    ChecklistModule,
    StorageModule,
    MessagesModule,
    CommentsModule,
    TeamModule,
    NotificationsModule,
    FinanceModule,
    SyncModule,
    PlansModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
        provide: APP_GUARD,
        useClass: SuperAdminGuard, // Proteção global (Regra 1)
    },
  ],
})
export class AppModule {}
