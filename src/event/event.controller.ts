import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCategory } from './dto/event.dto';
import { Filter, FindManyOptions, MoreThan } from 'typeorm';
import { CreateEventDto } from './dto/create-event.dto';
import { Event } from './entities/event.entity';
import { EventStatus } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  async find(
    @Query('filter') filter: string
  ) {
    let options: FindManyOptions;

    try {
      options = JSON.parse(filter);
    } catch (error) {
      throw new Error('Invalid filter format. Expected JSON string.');
    }
    return await this.eventService.find(options);
  }

  @Get('my-events/:id')
  async getMyEvents(@Param('id') id: number) {
    console.log(id)
    return await this.eventService.getMyEvents(id);
  }

  @Get('upcoming')
  async findUpcoming(
    @Query('limit') limit: number
  ) {
    let options: FindManyOptions = {
      where: {
        status: EventStatus.APPROVED,
        startTime: MoreThan(new Date())
      },
      order: {
        startTime: 'ASC'
      },
      take: limit
    }
    return await this.eventService.find(options);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return await this.eventService.getEventWithMiniEventsAndTicketRanks(+id);
  }

  @Post()
  async create(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.create(createEventDto);
  }
}
