import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Event, EventWithPrice, EventWithMiniEventsAndTicketRanks } from './entities/event.entity';
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { TicketRankService } from 'src/ticket-rank/ticket-rank.service';
import { MiniEvent, MiniEventWithTicketRank } from 'src/mini-event/entities/mini-event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { min, max } from 'date-fns';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
    @InjectRepository(MiniEventWithTicketRank) private readonly miniEventWithTicketRankRepository: Repository<MiniEventWithTicketRank>,
    @InjectRepository(TicketRank) private readonly ticketRankRepository: Repository<TicketRank>,
    private readonly miniEventService: MiniEventService,
    private readonly ticketRankService: TicketRankService
  ) { }

  async find(filter: FindManyOptions<Event>): Promise<EventWithPrice[]> {
    const events = await this.eventRepository.find(filter);

    const promises = events.map(async (event) => {

      let minPrice = await this.miniEventService.findMinPriceTicketRank(event.id);

      return {
        ...event,
        price: minPrice
      }
    });

    return Promise.all(promises);
  }

  async getMyEvents(
    organizationId: number,
    filter: FindManyOptions<Event> = {}
  ): Promise<Omit<EventWithMiniEventsAndTicketRanks, 'date' | 'price'>[]> {
    const events = await this.eventRepository.find({
      where: { organizationId, ...filter.where },
      ...filter,
    });

    const promises = events.map(async (event) => {
      const miniEventsWithTicketRanks = await this.miniEventService.getMiniEventWithTicketRanks(event.id);

      return {
        ...event, // Spread the event data
        miniEvents: miniEventsWithTicketRanks, // Include mini events
      };
    });

    return Promise.all(promises);
  }

  async getEventWithMiniEventsAndTicketRanks(id: number): Promise<EventWithMiniEventsAndTicketRanks> {
    const event = await this.find({ where: { id } });

    const miniEvents = await this.miniEventService.getMiniEventWithTicketRanks(id);

    return { ...event[0], miniEvents: miniEvents };
  }

  async create(createEventDto: CreateEventDto): Promise<Event> {
    // Calculate the earliest and latest dates from miniEvents
    let startTime: Date | null = null;
    let endTime: Date | null = null;

    if (createEventDto.miniEvents && createEventDto.miniEvents.length > 0) {
      const miniEventDates = createEventDto.miniEvents.map(me => new Date(me.startTime));
      startTime = min(miniEventDates);
      const miniEventEndDates = createEventDto.miniEvents.map(me => new Date(me.endTime));
      endTime = max(miniEventEndDates);
    }

    // Create the main event with the calculated startTime and endTime
    const event = this.eventRepository.create({
      ...createEventDto,
      startTime,
      endTime,
    });

    const savedEvent = await this.eventRepository.save(event);

    // Create mini events and associate them with the saved event
    if (createEventDto.miniEvents && createEventDto.miniEvents.length > 0) {
      for (const miniEventDto of createEventDto.miniEvents) {
        await this.miniEventService.create(miniEventDto, savedEvent.id);
      }
    }

    return savedEvent;
  }

}

