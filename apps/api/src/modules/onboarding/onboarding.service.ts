import { 
  Injectable, 
  BadRequestException, 
  InternalServerErrorException,
  Logger 
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { hashData } from '../../common/utils/hash.util';
import { OnboardingDto } from './dto/onboarding.dto';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(private readonly supabase: SupabaseService) {}

  async register(dto: OnboardingDto) {
    const admin = this.supabase.getAdminClient();

    // 1. Criar usuário no Auth (Sync)
    const { data: auth, error: authError } = await admin.auth.admin.createUser({
      email: dto.email,
      password: dto.password,
      email_confirm: true,
      user_metadata: {
        name: dto.responsible.name,
      },
    });

    if (authError) {
      this.logger.error(`Erro ao criar usuário: ${authError.message}`);
      throw new BadRequestException(`Autenticação: ${authError.message}`);
    }

    const userId = auth.user.id;

    try {
      // 2. Global Users (hashes PII)
      const { error: userError } = await admin
        .from('global_users')
        .insert({
          id: userId,
          name: dto.responsible.name,
          email_hash: hashData(dto.email),
          cpf_cnpj_hash: hashData(dto.responsible.cpf),
          is_active: true,
        });

      if (userError) throw userError;

      // 3. Tenants (Empresa)
      const { data: tenant, error: tenantError } = await admin
        .from('tenants')
        .insert({
          type: dto.tenantType,
          name: dto.company.legalName,
          fantasy_name: dto.company.fantasyName,
          cnpj: dto.company.cnpj,
          phone: dto.company.phone,
          plan_id: dto.planId,
          is_active: true,
        })
        .select()
        .single();

      if (tenantError) throw tenantError;

      // 4. Membership (OWNER)
      const { error: memError } = await admin
        .from('tenant_user_memberships')
        .insert({
          tenant_id: tenant.id,
          user_id: userId,
          role: 'OWNER',
          is_active: true,
        });

      if (memError) throw memError;

      // 4.1 Update User Metadata with the newly created tenant for immediate access
      await admin.auth.admin.updateUserById(userId, {
        user_metadata: {
          name: dto.responsible.name,
          active_tenant_id: tenant.id,
          active_tenant_type: dto.tenantType,
          active_role: 'OWNER'
        }
      });

      // 5. Address
      const { error: addrError } = await admin
        .from('tenant_addresses')
        .insert({
          tenant_id: tenant.id,
          ...dto.address,
        });

      if (addrError) throw addrError;

      // 6. Responsible Persons
      const { error: respError } = await admin
        .from('tenant_responsible_persons')
        .insert({
          tenant_id: tenant.id,
          user_id: userId,
          role_in_company: dto.responsible.roleInCompany,
          cpf_hash: hashData(dto.responsible.cpf),
          phone_hash: hashData(dto.responsible.phone),
        });

      if (respError) throw respError;

      return {
        success: true,
        message: 'Cadastro corporativo realizado com sucesso.',
        userId,
      };

    } catch (dbError) {
      this.logger.error(`Erro no banco de dados durante onboarding: ${JSON.stringify(dbError)}`);
      
      // Rollback manual (apagar do auth users) se algo no banco falhar
      await admin.auth.admin.deleteUser(userId);
      
      throw new InternalServerErrorException(`Erro no banco: ${JSON.stringify(dbError)}`);
    }
  }
}
