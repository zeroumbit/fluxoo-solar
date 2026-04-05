import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class PlansService {
  constructor(private readonly supabase: SupabaseService) {}

  async findAll(targetType?: string) {
    const admin = this.supabase.getAdminClient();
    let query = admin.from('plans').select('*').order('sort_order', { ascending: true });

    if (targetType) {
      query = query.or(`target_type.eq.${targetType},target_type.eq.ANY`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin.from('plans').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
  }

  async create(dto: any) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin.from('plans').insert(dto).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async update(id: string, dto: any) {
    const admin = this.supabase.getAdminClient();
    const { data, error } = await admin.from('plans').update(dto).eq('id', id).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async remove(id: string) {
    const admin = this.supabase.getAdminClient();
    const { error } = await admin.from('plans').delete().eq('id', id);
    if (error) throw new BadRequestException(error.message);
    return { success: true };
  }
}
