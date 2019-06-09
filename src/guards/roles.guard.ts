import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoomService } from '../services/room.service';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly roomService: RoomService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const { params, body } = context.getArgByIndex(0);
    const code = params.code || body.code;
    const room = this.roomService.getRoom(code);

    const meetsRole =
      room &&
      (!roles.length ||
        (roles.includes(Role.ADMIN) && room.codes.admin === code) ||
        (roles.includes(Role.SPECTATOR) && room.codes.spectator === code));

    if (!meetsRole) {
      throw new HttpException(
        'The provided code does not grant access',
        HttpStatus.FORBIDDEN,
      );
    }
    return true;
  }
}
