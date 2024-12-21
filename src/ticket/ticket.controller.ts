import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TicketService } from './ticket.service';
import { Ticket } from './entities/ticket.entity';
import { FindManyOptions } from 'typeorm';
import { TicketStatus } from './dto/ticket.dto';

@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) { }

  @Get(':id')
  async getTickets(
    @Param('id') id: string,
    @Query('status') status: string  // status là chuỗi từ query
  ): Promise<Ticket[]> {
    let ticketStatus: TicketStatus | undefined;
    try {
      // Nếu có status, thì kiểm tra và ép kiểu thành TicketStatus
      if (status) {
        ticketStatus = TicketStatus[status.toUpperCase() as keyof typeof TicketStatus];

        if (!ticketStatus) {
          throw new Error('Invalid status value.');
        }
      }
      return this.ticketService.getTicketsByUserId(Number(id), ticketStatus);
    } catch (error) {
      console.error('Error in getTickets:', error.message);
      throw new Error('Failed to get tickets.');
    }
  }




  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketService.remove(+id);
  }
}
