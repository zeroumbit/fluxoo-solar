import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @IsString() @IsNotEmpty() clientCpf: string;
  
  // Se novo cliente
  @IsString() @IsOptional() clientName?: string;
  @IsEmail() @IsOptional() clientEmail?: string;
  @IsString() @IsOptional() clientPhone?: string;

  // Se projeto
  @IsString() @IsNotEmpty() title: string;
  @IsNumber() @IsNotEmpty() totalValueCents: number;
  @IsString() @IsNotEmpty() expectedCompletionDate: string;
  @IsString() @IsOptional() resellerTenantId?: string;
}
