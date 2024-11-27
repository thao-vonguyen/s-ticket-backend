import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventModule } from './event/event.module';
import { Event } from './event/entities/event.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'aws-0-ap-southeast-1.pooler.supabase.com',
      port: 5432,
      password: 'VLYmuJ5UFWURmHcx',
      username: 'postgres.vepooluprzkesyzrzzjx',
      entities: [Event],
      database: 'postgres',
      synchronize: true,
      logging: true,
    }),
    EventModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}