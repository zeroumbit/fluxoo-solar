import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class SyncService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Processamento em lote de operações offline (Regra 5).
   * Recebe uma fila de comandos do IndexedDB e processa em ordem.
   */
  async processBatch(userId: string, tenantId: string, operations: any[]) {
    const admin = this.supabase.getAdminClient();
    const results: Array<{ opId: any; success: boolean; res?: any; error?: string }> = [];

    // Processamento sequencial para garantir ordem cronológica da fila (Regra 5)
    for (const op of operations) {
        try {
            let res;
            switch(op.type) {
                case 'CREATE_PROJECT':
                    res = await this.handleCreateProject(admin, userId, tenantId, op.payload);
                    break;
                case 'CHECKLIST_UPLOAD':
                    res = await this.handleChecklistUpload(admin, op.payload);
                    break;
                default:
                    throw new Error(`Operação desconhecida: ${op.type}`);
            }
            results.push({ opId: op.id, success: true, res });
        } catch (err: any) {
            results.push({ opId: op.id, success: false, error: err.message });
        }
    }

    return { results };
  }

  private async handleCreateProject(admin: any, userId: string, tenantId: string, payload: any) {
      const { data, error } = await admin
        .from('projects')
        .insert({
            ...payload,
            creator_user_id: userId,
            tenant_id: tenantId,
            owner_tenant_id: tenantId,
            status: 'PROSPECTING',
            created_at: payload.timestamp || new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) throw error;
      return data;
  }

  private async handleChecklistUpload(admin: any, payload: any) {
       const { error } = await admin
          .from('checklist_items')
          .update({
              file_url: payload.fileUrl,
              file_name: payload.fileName,
              status: 'PENDING'
          })
          .eq('id', payload.itemId);

       if (error) throw error;
       return { success: true };
  }
}
