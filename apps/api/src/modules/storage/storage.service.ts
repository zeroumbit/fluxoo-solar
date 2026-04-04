import { Injectable, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class StorageService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Gera uma Signed URL para permitir o upload direto do navegador ao bucket.
   * Prefixo: projects/{project_id}/checklist/{item_id}/{file_name}
   */
  async generateUploadUrl(projectId: string, itemId: string, fileName: string) {
    const admin = this.supabase.getAdminClient();
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `projects/${projectId}/checklist/${itemId}/${sanitizedFileName}`;

    // Bucket name = 'fluxoo-documents'
    const { data, error } = await admin.storage
      .from('fluxoo-documents')
      .createSignedUploadUrl(filePath);

    if (error) {
      throw new BadRequestException(`Erro Storage: ${error.message}`);
    }

    // Get public URL to store in checklist_items DB
    const { data: publicUrlData } = admin.storage
      .from('fluxoo-documents')
      .getPublicUrl(filePath);

    return {
      uploadUrl: data.signedUrl,
      fileUrl: publicUrlData.publicUrl,
      filePath,
    };
  }
}
