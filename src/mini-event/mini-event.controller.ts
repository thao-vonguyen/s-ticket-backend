// import { Controller, Post, Body } from '@nestjs/common';
// import { MiniEventService } from './mini-event.service';
// import { CreateMiniEventWithTicketRankDto } from './dto/create-mini-event-with-ticketrank.dto';
// @Controller('mini-event')
// export class MiniEventController {
//   constructor(private readonly miniEventService: MiniEventService) {}
  
  
// }

// src/mini-event/mini-event.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { MiniEventService } from './mini-event.service';
import { CreateMiniEventWithTicketRankDto } from './dto/create-mini-event-with-ticketrank.dto';
import { MiniEvent } from './entities/mini-event.entity';

@Controller('mini-event')
export class MiniEventController {
    constructor(private readonly miniEventService: MiniEventService) {}

    @Post()
    async create(@Body() createMiniEventWithTicketRankDto: CreateMiniEventWithTicketRankDto): Promise<MiniEvent> {
        // Log the received DTO for debugging purposes
        console.log('Received DTO:', createMiniEventWithTicketRankDto);
        
        // Call the service to create the mini event and return the result
        return this.miniEventService.create(createMiniEventWithTicketRankDto);
    }
}