import { Module } from '@nestjs/common';
import { MiniEventService } from './mini-event.service';
import { MiniEventController } from './mini-event.controller';
import { MiniEvent } from './entities/mini-event.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MiniEvent])],
  controllers: [MiniEventController],
  providers: [MiniEventService],
})
export class MiniEventModule {}
