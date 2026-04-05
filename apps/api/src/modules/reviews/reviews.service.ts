import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ReviewsService {
  constructor(private readonly supabase: SupabaseService) {}

  async getReviews(activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    // Buscar reviews de projetos delegados à engenharia
    const { data: reviews, error } = await admin
      .from('project_reviews')
      .select(`
        *,
        project:projects(id, title, code, integrator:tenants!owner_tenant_id(fantasy_name, name)),
        reviewer:global_users(name, email)
      `)
      .eq('engineering_tenant_id', activeTenantId)
      .order('created_at', { ascending: false });

    if (error) {
      // Se a tabela não existir, retorna vazio
      console.warn('Erro ao buscar reviews:', error.message);
      return [];
    }

    return reviews;
  }

  async respondReview(reviewId: string, response: string, activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    const { error } = await admin
      .from('project_reviews')
      .update({ engineering_response: response, responded_at: new Date().toISOString() })
      .eq('id', reviewId)
      .eq('engineering_tenant_id', activeTenantId);

    if (error) throw new BadRequestException(error.message);

    return { success: true };
  }

  async getAverageRating(activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    const { data, error } = await admin
      .from('project_reviews')
      .select('rating')
      .eq('engineering_tenant_id', activeTenantId);

    if (error) return { average: 0, count: 0 };

    const reviews = data || [];
    const average = reviews.length > 0
      ? reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / reviews.length
      : 0;

    return { average: Number(average.toFixed(1)), count: reviews.length };
  }
}
