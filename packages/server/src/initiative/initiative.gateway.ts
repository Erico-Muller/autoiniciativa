import {
   WebSocketGateway,
   OnGatewayConnection,
   WebSocketServer,
   SubscribeMessage,
   ConnectedSocket,
   MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
   cors: {
      origin: process.env.FRONTEND_BASE_URL,
   },
})
export class InitiativeGateway implements OnGatewayConnection {
   @WebSocketServer()
   private server: Server

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   handleConnection(client: any, ...args: any[]) {
      console.log(`connection established: ${client.id}`)
   }
}
