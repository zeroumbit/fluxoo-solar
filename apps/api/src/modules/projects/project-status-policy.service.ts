import { Injectable, ForbiddenException, BadRequestException } from '@nestjs/common';

export type ProjectStatus = 'PROSPECTING' | 'DESIGNING' | 'HOMOLOGATION' | 'INSTALLED' | 'COMPLETED';

@Injectable()
export class ProjectStatusPolicyService {
  /**
   * Define as transições permitidas no state machine.
   */
  private readonly allowedTransitions: Record<ProjectStatus, ProjectStatus[]> = {
    PROSPECTING: ['DESIGNING'],
    DESIGNING: ['HOMOLOGATION'],
    HOMOLOGATION: ['INSTALLED'],
    INSTALLED: ['COMPLETED'],
    COMPLETED: [],
  };

  /**
   * Valida se uma transição é permitida por Role e Ownership.
   * Regra 4 e 5 da Fase 4.
   */
  validateTransition(
    currentStatus: ProjectStatus,
    newStatus: ProjectStatus,
    userRole: string,
    isOwnerTenant: boolean,
    isDelegatedEngineering: boolean
  ) {
    // 1. Validar se a transição existe no state machine
    if (!this.allowedTransitions[currentStatus]?.includes(newStatus)) {
      throw new BadRequestException(`Transição de ${currentStatus} para ${newStatus} não é permitida.`);
    }

    // 2. Validação por Role e Tipo de Acesso
    if (currentStatus === 'PROSPECTING' && newStatus === 'DESIGNING') {
      if (!isOwnerTenant || !['OWNER', 'MANAGER', 'ENGINEER'].includes(userRole)) {
        throw new ForbiddenException('Apenas a Integradora (Owner/Manager/Engineer) pode iniciar a fase de design.');
      }
    }

    if (currentStatus === 'DESIGNING' && newStatus === 'HOMOLOGATION') {
      if (!(isDelegatedEngineering || isOwnerTenant)) {
        throw new ForbiddenException('Apenas a Engenharia delegada ou a Integradora podem enviar para homologação.');
      }
    }

    if (currentStatus === 'HOMOLOGATION' && newStatus === 'INSTALLED') {
      if (!isOwnerTenant || !['OWNER', 'MANAGER'].includes(userRole)) {
        throw new ForbiddenException('Apenas a Integradora (Owner/Manager) pode aprovar a instalação.');
      }
    }

    if (currentStatus === 'INSTALLED' && newStatus === 'COMPLETED') {
      if (!isOwnerTenant || userRole !== 'OWNER') {
        throw new ForbiddenException('Apenas o Proprietário (OWNER) da Integradora pode finalizar o projeto.');
      }
    }

    return true;
  }
}
