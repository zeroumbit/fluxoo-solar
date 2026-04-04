import { Injectable, Module, Global, BadRequestException } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private client: SupabaseClient;

  constructor(private config = new ConfigService()) {}

  /**
   * Retorna o cliente com permissões administrativas (Service Role)
   * Acesso seguro via variáveis de ambiente do backend.
   */
  getAdminClient() {
    if (this.client) return this.client;

    const url = this.config.get<string>('SUPABASE_URL');
    const key = this.config.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!url || !key) {
      throw new Error('Supabase Service Role Key ou URL não configurada');
    }

    this.client = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    return this.client;
  }
}

@Global()
@Module({
  imports: [ConfigModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}
