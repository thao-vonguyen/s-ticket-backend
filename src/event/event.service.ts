import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventCategory } from './dto/event.dto';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event) private readonly eventRepository: Repository<Event>,
  ) {}
  findRecent({ offset, limit }) {
    return this.eventRepository.find({ skip: offset, take: limit });
  }

  find(category?: EventCategory) {
    return this.eventRepository.find({
      where: { category }
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
