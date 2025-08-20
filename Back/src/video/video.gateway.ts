import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private jobSockets = new Map<string, Set<string>>();

  handleConnection(client: Socket) {
    console.log(`클라이언트 연결됨: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`클라이언트 연결 해제됨: ${client.id}`);
    this.cleanupClientFromJobs(client.id);
  }

  @SubscribeMessage('subscribeToJob')
  handleSubscribeToJob(
    client: Socket,
    payload: { jobId: string; clientId: string },
  ) {
    const { jobId, clientId } = payload;
    this.subscribeToJob(jobId, clientId);
    client.emit('subscribed', { jobId, message: '작업 구독 완료' });
  }

  subscribeToJob(jobId: string, clientId: string) {
    if (!this.jobSockets.has(jobId)) {
      this.jobSockets.set(jobId, new Set());
    }
    this.jobSockets.get(jobId)!.add(clientId);
    console.log(`클라이언트 ${clientId}가 작업 ${jobId}을 구독함`);
  }

  sendProgress(jobId: string, progress: number) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('progress', {
          jobId,
          progress: Math.round(progress * 100),
        });
      });
    }
  }

  sendCompleted(jobId: string, outputPath: string) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('completed', {
          jobId,
          outputPath,
        });
      });
      this.jobSockets.delete(jobId);
    }
  }

  sendError(jobId: string, error: string) {
    const clients = this.jobSockets.get(jobId);
    if (clients) {
      clients.forEach((clientId) => {
        this.server.to(clientId).emit('error', {
          jobId,
          error,
        });
      });
      this.jobSockets.delete(jobId);
    }
  }

  private cleanupClientFromJobs(clientId: string) {
    this.jobSockets.forEach((clients, jobId) => {
      clients.delete(clientId);
      if (clients.size === 0) {
        this.jobSockets.delete(jobId);
      }
    });
  }
}
