import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsEnum, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { EventService } from './../event.service';
import { EventCategory, EventStatus } from './event.dto';
import { CreateMiniEventWithTicketRankDto } from 'src/mini-event/dto/create-mini-event-with-ticketrank.dto';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  organizationId: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsEnum(EventCategory)
  @IsNotEmpty()
  category: EventCategory;

  @IsOptional()
  @IsString()
  organizerName?: string;

  @IsOptional()
  @IsString()
  organizerDescription?: string;

  @IsOptional()
  @IsString()
  organizerImage?: string;

  @IsOptional()
  @IsString()
  bankAccountName?: string;

  @IsOptional()
  @IsString()
  bankAccountNumber?: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  bankBranch?: string;

  @IsEnum(EventStatus)
  @IsNotEmpty()
  status: EventStatus;

  @IsBoolean()
  @IsNotEmpty()
  isOnAd: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMiniEventWithTicketRankDto) // Transform to CreateTicketRankDto
  miniEvents: CreateMiniEventWithTicketRankDto[];
}
