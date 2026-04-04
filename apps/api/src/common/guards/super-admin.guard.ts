import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class SuperAdminGuard implements CanActivate {
  private readonly SUPER_ADMIN_EMAIL = 'zeroumbit@gmail.com';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Obtido via AuthGuard (JWT)

    // Se o usuário Logado é o Super Admin (pela email ou active_tenant_type na claim)
    const isSuperAdmin =
      user?.email === this.SUPER_ADMIN_EMAIL ||
      user?.app_metadata?.active_tenant_type === 'SUPER_ADMIN';

    if (!isSuperAdmin) return true;

    // Regra 1: Bloquear endpoints sensíveis quando logado como Super Admin
    const sensitivePrefixes = [
        '/projects', 
        '/users', 
        '/messages', 
        '/checklist', 
        '/files', 
        '/finance/summary', // Pode ver agregados, então vamos ser específicos
        '/finance/engineering' 
    ];

    const isSensitive = sensitivePrefixes.some((prefix) =>
      request.url.startsWith(prefix),
    );

    // Permitir métricas agregadas específicas se necessário
    if (request.url.includes('/finance/metrics')) return true;

    if (isSensitive) {
      throw new ForbiddenException('Super Admin não tem acesso direto a dados sensíveis de produção (Regra 1)');
    }

    return true;
  }
}
