import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketRank } from './entities/ticket-rank.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateTicketRankDto } from './dto/create-ticketrank.dto';

@Injectable()
export class TicketRankService {
    constructor(
        @InjectRepository(TicketRank) private readonly ticketRankRepository: Repository<TicketRank>
    ) {}

    async findMinPriceTicketRank(miniEventId: number): Promise<TicketRank> {
        return await this.ticketRankRepository.findOne({
            where: { miniEventId },
            order: { price: 'ASC' }
        });
    }

    async find(filter: FindManyOptions<TicketRank>): Promise<TicketRank[]> {
        return await this.ticketRankRepository.find(filter);
    }

    async create(createTicketRankDto: CreateTicketRankDto): Promise<TicketRank> {
        const ticketRank = this.ticketRankRepository.create(createTicketRankDto);
        return this.ticketRankRepository.save(ticketRank);
    }
}
