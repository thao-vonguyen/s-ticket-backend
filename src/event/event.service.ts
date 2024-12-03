import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCategory, EventStatus } from './dto/event.dto';
import { Filter, FindManyOptions, Repository } from 'typeorm';
import { Event } from './entities/event.entity';
import { MiniEventService } from 'src/mini-event/mini-event.service';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
    private readonly miniEventService: MiniEventService
  ) {}
  findUpcoming(filter: FindManyOptions<Event>) {
    return this.eventRepository.find({ 
      order: { createdTime: 'DESC' },  
    });
  }

  async find(filter: FindManyOptions<Event>) {
    const events = await this.eventRepository.find(filter);

    const eventList = events.map(async(event) => {
      let firstMiniEvent = await this.miniEventService.getFirstMiniEventByEventId(event.id);

      return {
        ...event,
        date: firstMiniEvent.startTime
      }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
