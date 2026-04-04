import { Module } from '@nestjs/common';
import { ChecklistService } from './checklist.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  providers: [ChecklistService],
  exports: [ChecklistService],
})
export class ChecklistModule {}
