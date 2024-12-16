import { IsString, IsNotEmpty, IsNumber, IsArray, ValidateNested, IsOptional, IsDate} from 'class-validator';
import { CreateTicketRankDto } from 'src/ticket-rank/dto/create-ticketrank.dto'; 
import { Type } from 'class-transformer';

export class CreateMiniEventWithTicketRankDto {
    @IsNotEmpty()
    @IsNumber()
    eventId: number;

    @IsString()
    @IsOptional()
    description: string;

    @IsDate()
    @IsNotEmpty()
    startTime: Date;

    @IsDate()
    @IsNotEmpty()
    endTime: Date;

    @IsString()
    @IsOptional()
    image: string;
    
    @IsString()
    @IsNotEmpty()
    rankName: string;
    
    @IsNumber()
    @IsNotEmpty()
    numberLimit: number;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTicketRankDto) // Transform to CreateTicketRankDto
    ticketRanks: CreateTicketRankDto[];

}