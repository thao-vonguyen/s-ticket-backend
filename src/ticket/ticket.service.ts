import { Injectable } from '@nestjs/common';

@Injectable()
export class TicketService {
  // create(createTicketDto: CreateTicketDto) {
  //   return 'This action adds a new ticket';
  // }

  findAll() {
    return `This action returns all ticket`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticket`;
  }

  // update(id: number, updateTicketDto: UpdateTicketDto) {
  //   return `This action updates a #${id} ticket`;
  // }

  remove(id: number) {
    return `This action removes a #${id} ticket`;
  }
}
