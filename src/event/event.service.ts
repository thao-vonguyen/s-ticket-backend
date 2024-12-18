import { Injectable, NotFoundException } from '@nestjs/common';
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
    const queryBuilder = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.miniEvents', 'miniEvent')
      .leftJoin('miniEvent.ticketRanks', 'ticketRank')
      .select([
        'event.*',
        'MIN(ticketRank.price) AS min_price'
      ])
      .where(filter.where || {})
      .groupBy('event.id')
      .limit(filter.take || 10)
      // .getRawMany();

    if (filter.order) {
      const order: Record<string, 'ASC' | 'DESC'> = {};
  
      Object.keys(filter.order).forEach((field) => {
        if (field === 'startTime') {
          field = 'start_time';
        } else if (field === 'createdTime') {
          field = 'created_time';
        }
        order[field] = filter.order[field];
      });
  
      // Sử dụng addOrderBy để xử lý nhiều trường hợp
      Object.keys(order).forEach((field) => {
        queryBuilder.addOrderBy(field, order[field]);
      });
    }

    const eventsWithPrice = await queryBuilder.getRawMany();

    return eventsWithPrice.map(event => ({
      id: event.event_id,
      name: event.event_name,
      startTime: event.start_time,
      image: event.image,
      price: event.min_price
    }));
  }

  async getAllEvents(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async updateEvent(id: number, body: Partial<Event>) {
    const event = await this.eventRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return this.eventRepository.update(id, body);
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
    const event = await this.eventRepository.findOne({
      where: { id: id },
      relations: ['miniEvents', 'miniEvents.ticketRanks'],
    });

    if (event) {
      let minPrice = Infinity; 
      event.miniEvents.forEach((miniEvent) => {
        miniEvent.ticketRanks.forEach((ticketRank) => {
          // Cập nhật giá trị minPrice nếu tìm thấy giá trị nhỏ hơn
          if (ticketRank.price < minPrice) {
            minPrice = ticketRank.price;
          }
        });
      });

      return { ...event, price: minPrice };
    }
    return null;    
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

