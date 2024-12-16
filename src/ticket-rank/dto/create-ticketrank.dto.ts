// src/ticket-rank/dto/create-ticket-rank.dto.ts
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTicketRankDto {
  @IsString()
  @IsNotEmpty()
  rankName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  numberLimit: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  miniEventId: number;

  @IsOptional()
  @IsNumber()
  soldNumber?: number; 
  
}