import { Module } from '@nestjs/common';
import { ImageService } from './services/image.service';
import { MediaController } from './controllers/media.controller';
import { RoomService } from './services/room.service';
import { RoomController } from './controllers/room.controller';
import { RoomGateway } from './gateways/room.gateway';
import { SecurityUtils } from './utils/security.utils';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [],
  controllers: [RoomController, MediaController],
  providers: [
    RoomService,
    ImageService,

    RoomGateway,

    SecurityUtils,

    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
