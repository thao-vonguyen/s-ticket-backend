import { Injectable, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { MiniEvent, MiniEventWithTicketRank } from './entities/mini-event.entity';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { CreateMiniEventWithTicketRankDto } from './dto/create-mini-event-with-ticketrank.dto';

@Injectable()
export class MiniEventService {
  [x: string]: any;
  constructor(
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
    private readonly ticketRankService: TicketRankService,
    @InjectRepository(TicketRank)
    private ticketRankRepository: Repository<TicketRank>,
  ) { }
  async getFirstMiniEventByEventId(eventId: number): Promise<MiniEvent> {
    return await this.miniEventRepository.findOne({
      where: { eventId },
      order: { createdTime: 'ASC' }
    });
  }

  async find(filter: FindManyOptions<MiniEvent>) {
    return await this.miniEventRepository.find(filter);
  }

  async findMyMiniEvents(eventId: number) {
    return await this.miniEventRepository.find({
      where: { eventId }
    });
  }

  async findMinPriceTicketRank(eventId: number): Promise<number> {
    const miniEvents = await this.miniEventRepository.find({
      where: { eventId }
    });

    const minPricePromise = miniEvents.map(async (miniEvent) => {
      return await this.ticketRankService.findMinPriceTicketRank(miniEvent.id);
    })

    const minPriceList = await Promise.all(minPricePromise);

    return minPriceList.reduce((minPrice, currentPrice) => {
      return currentPrice < minPrice ? currentPrice : minPrice;
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

  async create(
    createMiniEventWithTicketRankDto: CreateMiniEventWithTicketRankDto,
    eventId: number,
  ): Promise<MiniEvent> {
    // Create the mini event
    const miniEvent = this.miniEventRepository.create({
      ...createMiniEventWithTicketRankDto,
      eventId, // Associate with the event
    });
    const savedMiniEvent = await this.miniEventRepository.save(miniEvent);
    
    // Create ticket ranks and associate them with the mini event
    const ticketRanks = createMiniEventWithTicketRankDto.ticketRanks.map(rank => {
      return {
        ...rank,
        miniEventId: savedMiniEvent.id, // Associate with the saved mini event
      };
    });

    // Save all ticket ranks to the database
    await this.ticketRankRepository.save(ticketRanks);

    return savedMiniEvent;
  }
}

