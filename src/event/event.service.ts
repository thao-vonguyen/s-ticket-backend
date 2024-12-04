import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Event, EventWithDateAndPrice, EventWithMiniEventsAndTicketRanks } from './entities/event.entity';
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { MiniEvent } from 'src/mini-event/entities/mini-event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
    private readonly miniEventService: MiniEventService,
    private readonly ticketRankService: TicketRankService
  ) {}
  async findUpcoming(limit: number): Promise<EventWithDateAndPrice[]> {
    const now = new Date();
    const miniEvents = await this.miniEventRepository
      .createQueryBuilder('miniEvent')
      .select([
        'miniEvent.id AS id',
        'miniEvent.event_id AS event_id',
        'miniEvent.start_time AS start_time'
      ])
      .where('miniEvent.start_time > :startTime', { startTime: new Date() }) // Thay thế tham số với thời gian thực tế
      .orderBy('miniEvent.eventId', 'ASC')
      .addOrderBy('miniEvent.startTime', 'ASC')
      .distinctOn(['miniEvent.eventId'])
      .limit(limit)
      .getRawMany(); 

    const promises = miniEvents.map(async (miniEvent) => {
      const event = await this.eventRepository.findOne({
        where: { id: miniEvent.event_id }
      });
      let minPriceTicketRank = await this.ticketRankService.findMinPriceTicketRank(event.id);
      return {
        ...event,
        date: miniEvent.startTime,
        price: minPriceTicketRank.price
      }
    });

    return Promise.all(promises);
  }

  async find(filter: FindManyOptions<Event>): Promise<EventWithDateAndPrice[]> {
    const events = await this.eventRepository.find(filter);

    const promises = events.map(async(event) => {
      let firstMiniEvent = await this.miniEventService.getFirstMiniEventByEventId(event.id);

      let minPriceTicketRank = await this.miniEventService.findMinPriceTicketRank(event.id);

      return {
        ...event,
        date: firstMiniEvent.startTime,
        price: minPriceTicketRank.price
      }
    });

    return Promise.all(promises);
  }

  async getEventWithMiniEventsAndTicketRanks(id: number): Promise<EventWithMiniEventsAndTicketRanks> {
    const event = await this.eventRepository.findOne({ where: { id } });
    let minPriceTicketRank = await this.miniEventService.findMinPriceTicketRank(event.id);

    const miniEvents = await this.miniEventService.getMiniEventWithTicketRanks(event.id);
    
    return { ...event, price: minPriceTicketRank.price, miniEvents: miniEvents };
  }
}
