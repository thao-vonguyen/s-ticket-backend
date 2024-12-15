import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber, IsEnum, IsBoolean } from 'class-validator';

export class CreateMiniEventDto {
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

}