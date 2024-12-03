import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventCategory } from './dto/event.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get()
  findByCategory(@Query('category') category?: EventCategory) {
    return this.eventService.find(category);
  }

  @Get('recent')
  findRecent(
    @Query('offset') offset: number,
    @Query('limit') limit: number
  ) {
    return this.eventService.findRecent({ offset, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }
}
