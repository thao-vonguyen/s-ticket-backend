import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Event, EventWithPrice, EventWithMiniEventsAndTicketRanks } from './entities/event.entity';
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { MiniEvent } from 'src/mini-event/entities/mini-event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly miniEventService: MiniEventService
  ) {}

  async find(filter: FindManyOptions<Event>): Promise<EventWithPrice[]> {
    const events = await this.eventRepository.find(filter);

    const promises = events.map(async(event) => {

      let minPriceTicketRank = await this.miniEventService.findMinPriceTicketRank(event.id);

      return {
        ...event,
        price: minPriceTicketRank.price
      }
    });

    return Promise.all(promises);
  }

  async getEventWithMiniEventsAndTicketRanks(id: number): Promise<EventWithMiniEventsAndTicketRanks> {
    const event = await this.find({ where: { id } });

    const miniEvents = await this.miniEventService.getMiniEventWithTicketRanks(id);
    
    return { ...event[0], miniEvents: miniEvents };
  }
}
