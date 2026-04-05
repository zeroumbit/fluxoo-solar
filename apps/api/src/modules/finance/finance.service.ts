import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class FinanceService {
  constructor(private readonly supabase: SupabaseService) {}

  /**
   * Resumo para Integradoras (Regra 4 - Agregações Apenas).
   */
  async getSummary(activeTenantId: string, activeRole: string) {
    const admin = this.supabase.getAdminClient();

    // 1. Apenas OWNER, MANAGER e FINANCE podem acessar
    if (!['OWNER', 'MANAGER', 'FINANCE'].includes(activeRole)) {
        throw new ForbiddenException('Acesso negado aos canais financeiros.');
    }

    // 2. Buscar projetos vinculados para agregação
    const { data: projects, error } = await admin
        .from('projects')
        .select('id, title, total_value_cents, status, owner_tenant_id')
        .eq('tenant_id', activeTenantId);

    if (error) throw new BadRequestException(error.message);

    // 3. Processar Agregações (Fase 5 MVP)
    const revenue = projects.reduce((acc, p) => acc + (p.total_value_cents || 0), 0);
    const statusCounts = projects.reduce((acc, p) => {
        const s = p.status as string;
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return {
        data: {
          monthly_revenue_cents: revenue,
          commissions_payable_cents: Math.floor(revenue * 0.15), // MVP: Simulação 15%
          engineering_payments_cents: Math.floor(revenue * 0.05), // MVP: Simulação 5%
          projects_by_status: statusCounts,
          commissions: [ // Dados Simulados (Aggregations only - Rule 4)
            { reseller_name: 'SolBr Vendas', amount_cents: 420000, percentage: 15 },
            { reseller_name: 'EcoEnergy', amount_cents: 180000, percentage: 12 }
          ],
          engineering_payments: [
            { engineering_name: 'Carla Engenharia', amount_cents: 250000, project_id: '123', status: 'Aguardando Aprovação' }
          ]
        }
    };
  }

  /**
   * Resumo para Empresas de Engenharia (Regra 4).
   */
  async getEngineeringSummary(activeTenantId: string) {
      const admin = this.supabase.getAdminClient();
      const { data: projects, error } = await admin
         .from('projects')
         .select('id, total_value_cents, status, owner_tenant_id')
         .eq('delegated_engineering_tenant_id', activeTenantId);

      if (error) throw new BadRequestException(error.message);

      const receivable = projects.reduce((acc, p) => acc + (p.total_value_cents || 0), 0) * 0.10; // Exemplo 10%

      return {
          total_receivable_cents: Math.floor(receivable),
          projects: projects.map(p => ({
              project_id: p.id,
              integrator_id: p.owner_tenant_id,
              amount_cents: Math.floor((p.total_value_cents || 0) * 0.10),
              status: p.status
          }))
      };
  }

  /**
   * Dados financeiros detalhados para Engenharia (dashboard).
   */
  async getEngineeringDetailedStats(activeTenantId: string) {
    const admin = this.supabase.getAdminClient();

    // Buscar projetos delegados com dados da integradora
    const { data: projects, error } = await admin
      .from('projects')
      .select(`
        id,
        title,
        total_value_cents,
        status,
        deadline,
        created_at,
        integrator:tenants!owner_tenant_id(id, name, fantasy_name)
      `)
      .eq('delegated_engineering_tenant_id', activeTenantId)
      .order('created_at', { ascending: false });

    if (error) throw new BadRequestException(error.message);

    const allProjects = projects || [];
    const now = new Date();

    // Projetos por status de pagamento
    const completedProjects = allProjects.filter(p => p.status === 'COMPLETED');
    const inProgressProjects = allProjects.filter(p =>
      ['DESIGNING', 'REVIEW', 'APPROVED', 'PENDING'].includes(p.status)
    );

    // Valor total faturado (projetos completados)
    const totalBilled = completedProjects.reduce(
      (acc, p) => acc + (p.total_value_cents || 0), 0
    );

    // Valor a receber (projetos em andamento)
    const totalReceivable = inProgressProjects.reduce(
      (acc, p) => acc + (p.total_value_cents || 0), 0
    );

    // Valor por integradora
    const revenueByIntegrator = allProjects.reduce((acc, p) => {
      const integrator = Array.isArray(p.integrator) ? p.integrator[0] : p.integrator;
      const integratorName = integrator?.fantasy_name || integrator?.name || 'Integradora';
      if (!acc[integratorName]) {
        acc[integratorName] = { count: 0, total_cents: 0 };
      }
      acc[integratorName].count++;
      acc[integratorName].total_cents += (p.total_value_cents || 0);
      return acc;
    }, {} as Record<string, { count: number; total_cents: number }>);

    // Valor por mês (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const recentProjects = allProjects.filter(
      p => new Date(p.created_at) >= sixMonthsAgo
    );

    const monthlyRevenue = recentProjects.reduce((acc, p) => {
      const date = new Date(p.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!acc[key]) acc[key] = 0;
      acc[key] += (p.total_value_cents || 0);
      return acc;
    }, {} as Record<string, number>);

    // Taxa de engenharia (10% do valor dos projetos)
    const engineeringFeePercent = 0.10;

    return {
      total_billed_cents: Math.floor(totalBilled * engineeringFeePercent),
      total_receivable_cents: Math.floor(totalReceivable * engineeringFeePercent),
      projects_count: allProjects.length,
      completed_count: completedProjects.length,
      in_progress_count: inProgressProjects.length,
      revenue_by_integrator: Object.entries(revenueByIntegrator).map(([name, data]) => ({
        name,
        count: data.count,
        total_cents: Math.floor(data.total_cents * engineeringFeePercent)
      })),
      monthly_revenue_cents: Object.entries(monthlyRevenue).map(([month, cents]) => ({
        month,
        cents: Math.floor(cents * engineeringFeePercent)
      }))
    };
  }
}
