import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TicketRank } from './entities/ticket-rank.entity';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class TicketRankService {
    constructor(
        @InjectRepository(TicketRank) private readonly ticketRankRepository: Repository<TicketRank>
    ) {}

    async findMinPriceTicketRank(miniEventId: number): Promise<number> {
        const result = await this.ticketRankRepository
            .createQueryBuilder('ticketRank')
            .select('MIN(ticketRank.price)', 'minPrice')
            .where('ticketRank.miniEventId = :miniEventId', { miniEventId })
            .getRawOne();
        return result.minPrice;
    }

    async find(filter: FindManyOptions<TicketRank>): Promise<TicketRank[]> {
        return await this.ticketRankRepository.find(filter);
    }
}
