import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { forwardRef, Inject } from '@nestjs/common';
import { RoomService } from '../services/room.service';
import { SocketEvent } from '../enums/socketEvent.enum';
import { IJoinRoomPayload } from '../interfaces/payloads/joinRoomPayload.interface';

@WebSocketGateway()
export class RoomGateway {
  @WebSocketServer() server: Server;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
  ) {}

  @SubscribeMessage(SocketEvent.JOIN_ROOM)
  joinRoom(client: Socket, payload: IJoinRoomPayload) {
    const room = this.roomService.getRoom(payload.accessCode);
    if (!room) {
      throw new WsException('Incorrect room code');
    }

    // join the room to be eligible for notifications
    client.join(payload.accessCode);

    // notify the client that he/she has joined a room
    client.emit(SocketEvent.ROOM_JOINED.toString(), null);
  }
}
