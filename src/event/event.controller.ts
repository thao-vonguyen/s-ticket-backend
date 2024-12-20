import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { EventStatus } from './dto/event.dto';
import { FindManyOptions, MoreThan } from 'typeorm';

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
}
