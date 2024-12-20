import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './entities/ticket.entity';
import { TicketRank } from 'src/ticket-rank/entities/ticket-rank.entity';
import { Event } from 'src/event/entities/event.entity';
import { MiniEvent } from 'src/mini-event/entities/mini-event.entity';

@Injectable()
export class TicketService {
  constructor(
    @InjectRepository(Ticket) private readonly ticketRepository: Repository<Ticket>,
    @InjectRepository(TicketRank) private ticketRankRepository: Repository<TicketRank>,
    @InjectRepository(MiniEvent) private miniEventRepository: Repository<MiniEvent>,
    @InjectRepository(Event) private eventRepository: Repository<Event>,
  ) { }

  async getTicketsByUserId(userId: number): Promise<Ticket[]> {
    console.log("hheheh", userId);
    const tickets = await this.ticketRepository.find({
      where: { userId },
      order: {
        ticketRankId: 'ASC',
        status: 'ASC',
      },
    });

    const uniqueTicketRankIds = [...new Set(tickets.map(ticket => ticket.ticketRankId))];

    const ticketRanks = await Promise.all(uniqueTicketRankIds.map(ticketRank =>
      this.ticketRankRepository.findOne({ where: { id: ticketRank } })
    ));

    const uniqueMiniEventIds = [...new Set(ticketRanks.map(ticket => ticket.miniEventId))];

    const miniEvents = await Promise.all(uniqueMiniEventIds.map(miniEventId =>
      this.miniEventRepository.findOne({ where: { id: miniEventId } })
    ));

    const uniqueEvent = [...new Set(miniEvents.map(ticket => ticket.eventId))];

    const events = await Promise.all(uniqueEvent.map(event =>
      this.eventRepository.findOne({ where: { id: event } })
    ));

    const ticketDetails = tickets.map(ticket => {
      const ticketRank = ticketRanks.find(tr => tr.id === ticket.ticketRankId);
      const miniEvent = miniEvents.find(me => me.id === ticketRank.miniEventId);
      const event = events.find(ev => ev.id === miniEvent.eventId);

      return {
        ...ticket,
        ticketRank,
        miniEvent,
        event,
      };
    });

    return ticketDetails;
  }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
