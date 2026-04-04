import { IsEmail, IsNotEmpty, IsString, ValidateNested, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export enum TenantType {
  INTEGRATOR = 'INTEGRATOR',
  ENGINEERING_FIRM = 'ENGINEERING_FIRM',
  RESELLER = 'RESELLER'
}

class CompanyDto {
  @IsString() @IsNotEmpty() cnpj: string;
  @IsString() @IsNotEmpty() legalName: string;
  @IsString() @IsNotEmpty() fantasyName: string;
  @IsString() @IsNotEmpty() phone: string;
}

class AddressDto {
  @IsString() @IsNotEmpty() cep: string;
  @IsString() @IsNotEmpty() street: string;
  @IsString() @IsNotEmpty() number: string;
  @IsString() complement?: string;
  @IsString() @IsNotEmpty() neighborhood: string;
  @IsString() @IsNotEmpty() city: string;
  @IsString() @IsNotEmpty() state: string;
}

class ResponsibleDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsNotEmpty() cpf: string;
  @IsString() @IsNotEmpty() roleInCompany: string;
  @IsString() @IsNotEmpty() phone: string;
}

export class OnboardingDto {
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() password: string;
  
  @IsEnum(TenantType) tenantType: TenantType;

  @ValidateNested() @Type(() => CompanyDto) company: CompanyDto;
  @ValidateNested() @Type(() => AddressDto) address: AddressDto;
  @ValidateNested() @Type(() => ResponsibleDto) responsible: ResponsibleDto;

  @IsString() @IsNotEmpty() planId: string;
}
