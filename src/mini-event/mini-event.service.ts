import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { MiniEvent, MiniEventWithTicketRank } from './entities/mini-event.entity';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';

@Injectable()
export class MiniEventService {
  constructor(
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
    private readonly ticketRankService: TicketRankService
  ) {}
  async getFirstMiniEventByEventId(eventId: number): Promise<MiniEvent> {
    return await this.miniEventRepository.findOne({ 
      where: { eventId },
      order: { createdTime: 'ASC' }
    });
  }

  async find(filter: FindManyOptions<MiniEvent>) {
    return await this.miniEventRepository.find(filter);
  }

  async findMinPriceTicketRank(eventId: number): Promise<TicketRank> {
    const miniEvents = await this.miniEventRepository.find({
      where: { eventId }
    });

    const ticketRankListPromise = miniEvents.map(async (miniEvent) => {
      return await this.ticketRankService.findMinPriceTicketRank(miniEvent.id);
    })

    const ticketRankList = await Promise.all(ticketRankListPromise);

    return ticketRankList.reduce((minItem, currentItem) => {
      return currentItem.price < minItem.price ? currentItem : minItem;
    });
  }

  async getMiniEventWithTicketRanks(eventId: number): Promise<MiniEventWithTicketRank[]> {
    const miniEvents = await this.miniEventRepository.find({ 
      where: { eventId },
      order: { createdTime: 'ASC' }
    }); 

    const miniEventListPromise = miniEvents.map(async (miniEvent) => {
      const ticketRanks = await this.ticketRankService.find({
        where: { miniEventId: miniEvent.id },
        order: { price: 'ASC' }
      })

      return { ...miniEvent, ticketRanks };
    })

    return await Promise.all(miniEventListPromise);
  }
}
