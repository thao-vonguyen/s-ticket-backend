import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { Event } from './event/entities/event.entity';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { MiniEventModule } from './mini-event/mini-event.module';
import { MiniEvent } from './mini-event/entities/mini-event.entity';
import { TicketRankModule } from './ticket-rank/ticket-rank.module';
import { TicketRank } from './ticket-rank/entities/ticket-rank.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 5432,
      password: 'VLYmuJ5UFWURmHcx',
      username: 'postgres.vepooluprzkesyzrzzjx',
      entities: [Event, User, MiniEvent, TicketRank],
      database: 'postgres',
      synchronize: false,
      logging: false,
    }),
    EventModule,
    UserModule,
    MiniEventModule,
    TicketRankModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}