import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiniEvent } from './entities/mini-event.entity';

@Injectable()
export class MiniEventService {
  constructor(
    @InjectRepository(MiniEvent) private readonly miniEventRepository: Repository<MiniEvent>,
  ) {}
  getFirstMiniEventByEventId(eventId: number) {
    return this.miniEventRepository.findOne({ 
      where: { eventId },
      order: { createdTime: 'ASC' }
    });
  }
}
