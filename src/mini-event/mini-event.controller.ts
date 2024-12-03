import { Controller } from '@nestjs/common';
import { MiniEventService } from './mini-event.service';

@Controller('mini-event')
export class MiniEventController {
  constructor(private readonly miniEventService: MiniEventService) {}

  
}
