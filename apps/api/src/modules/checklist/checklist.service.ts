import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

export enum ChecklistStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

@Injectable()
export class ChecklistService {
  constructor(private readonly supabase: SupabaseService) {}

  async updateItemStatus(itemId: string, status: ChecklistStatus, rejectionReason?: string) {
    const admin = this.supabase.getAdminClient();

    if (status === ChecklistStatus.REJECTED && !rejectionReason) {
      throw new BadRequestException('Um motivo de rejeição deve ser fornecido para este status.');
    }

    const { data, error } = await admin
      .from('checklist_items')
      .update({
        status, 
        rejection_reason: rejectionReason || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();

    if (error) throw new BadRequestException(`Erro ao atualizar checklist: ${error.message}`);
    return data;
  }

  async updateFile(itemId: string, fileUrl: string, fileName: string) {
     const admin = this.supabase.getAdminClient();
     const { data, error } = await admin
        .from('checklist_items')
        .update({
            file_url: fileUrl,
            file_name: fileName,
            status: ChecklistStatus.PENDING, // Volta para pendente quando um novo arquivo é enviado
            updated_at: new Date().toISOString()
        })
        .eq('id', itemId);

     if (error) throw new BadRequestException(error.message);
     return { success: true };
  }
}
