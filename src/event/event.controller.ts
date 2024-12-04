import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCategory } from './dto/event.dto';
import { Filter, FindManyOptions } from 'typeorm';

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
    return this.eventService.find(options);
  }

  @Get('upcoming')
  async findUpcoming(
    @Query('limit') limit: number
  ) {
    return await this.eventService.findUpcoming(limit);
  }

  @Get(':id')
  async getEvent(@Param('id') id: string) {
    return await this.eventService.getEventWithMiniEventsAndTicketRanks(+id);
  }
}
