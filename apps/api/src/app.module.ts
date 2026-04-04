import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
