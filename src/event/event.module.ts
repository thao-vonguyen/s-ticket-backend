import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity'
import { MiniEventService } from 'src/mini-event/mini-event.service';
import { MiniEvent } from 'src/mini-event/entities/mini-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, MiniEvent])],
  controllers: [EventController],
  providers: [EventService, MiniEventService],
})
export class EventModule {}
