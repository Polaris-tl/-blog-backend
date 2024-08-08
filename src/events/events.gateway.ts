import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsAuthGuard } from '@/common/gurad/wsAuth';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    client.send({
      type: 'init',
    });
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  @UseGuards(WsAuthGuard)
  handleMessage(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { roomId, message } = body || {};
    const user = client.handshake.auth.user;
    if (roomId) {
      this.server.to(roomId).emit('message', {
        from: user,
        to: roomId,
        message,
      });
    }
  }

  // 离开房间
  @SubscribeMessage('leave')
  @UseGuards(WsAuthGuard)
  handleLeave(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { roomId } = body || {};
    const user = client.handshake.auth.user;

    this.server.to(roomId).emit('leave', {
      user,
      roomId,
    });
    client.leave(roomId);
  }

  // 加入房间
  @SubscribeMessage('join')
  @UseGuards(WsAuthGuard)
  handleJoin(@MessageBody() body: any, @ConnectedSocket() client: Socket) {
    const { roomId } = body || {};
    const user = client.handshake.auth.user;

    if (!roomId) {
      client.emit('join', '请提供房间号');
      return;
    }
    if (!user) {
      client.send('请登陆后重试');
      return;
    }
    client.join(roomId);
    const room = this.server.sockets.adapter.rooms.get(body.roomId);
    if (room) {
      this.server.to(roomId).emit('join', {
        user,
        roomId,
        total: room.size,
      });
    }
  }

  // 获取当前房间的人数
  @SubscribeMessage('getRoomUsers')
  handleGetRoomUsers(@MessageBody() body: any) {
    const room = this.server.sockets.adapter.rooms.get(body.roomId);
    if (room) {
      this.server.to(body.roomId).emit('getRoomUsers', room.size);
    } else {
      this.server.to(body.roomId).emit('getRoomUsers', 0);
    }
  }
}
