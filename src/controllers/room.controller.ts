import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { IMulterFile } from '../interfaces/multerFile.interface';
import { RoomService } from '../services/room.service';
import { IMember } from '../shared/interfaces/member.interface';
import { IRoom } from '../shared/interfaces/room.interface';
import { IRoomConfiguration } from '../shared/interfaces/roomConfiguration.interface';

@Controller('api/room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(): IRoom {
    return this.roomService.createRoom();
  }

  @Post(':code/member')
  @Roles()
  @UseInterceptors(FileInterceptor('file'))
  addMember(
    @Param('code') code: string,
    @Body() member: IMember,
    @UploadedFile() file?: IMulterFile,
  ): Promise<IMember> {
    return this.roomService.addMember(
      code,
      member,
      file ? file.buffer.toString('base64') : null,
    );
  }

  @Put(':code/member/:id')
  @Roles(Role.ADMIN)
  updateMember(
    @Param('code') code: string,
    @Param('id') id: string,
    @Body() member: IMember,
  ): IMember {
    return this.roomService.updateMember(code, id, member);
  }

  @Delete(':code/member/:id')
  @Roles(Role.ADMIN)
  deleteMember(@Param('code') code: string, @Param('id') id: string): IMember {
    return this.roomService.deleteMember(code, id);
  }

  @Post(':code/generate')
  @Roles(Role.ADMIN)
  startGeneration(@Param('code') code: string): void {
    this.roomService.generateTeams(code);
  }

  @Put(':code/configuration')
  @Roles(Role.ADMIN)
  configureRoom(
    @Param('code') code: string,
    @Body() configuration: IRoomConfiguration,
  ): IRoom {
    return this.roomService.applyConfiguration(code, configuration);
  }

  @Get(':code')
  getRoom(@Param('code') code: string): IRoom {
    const room = this.roomService.getRoom(code);

    // remove the admin code if the spectator code was given
    if (room && room.codes.admin !== code) {
      return {
        ...room,

        codes: {
          admin: null,
          spectator: room.codes.spectator,
        },
      };
    }

    return room;
  }
}
