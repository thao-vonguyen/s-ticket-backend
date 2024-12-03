import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCategory } from './dto/event.dto';
import { Filter, FindManyOptions } from 'typeorm';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  find(
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
  findUpcoming(
    @Query('filter') filter: string
  ) {
    let options: FindManyOptions;

    try {
      options = JSON.parse(filter);
    } catch (error) {
      throw new Error('Invalid filter format. Expected JSON string.');
    }
    return this.eventService.findUpcoming(options);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }
}
