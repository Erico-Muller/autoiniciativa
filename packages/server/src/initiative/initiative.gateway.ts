import {
   WebSocketGateway,
   OnGatewayConnection,
   WebSocketServer,
   SubscribeMessage,
   MessageBody,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { RollDto } from './dto/roll.dto'
import { PassDto } from './dto/pass.dto'
import { ClearDto } from './dto/clear.dto'

import { character as Character, role as Role } from '@prisma/client'

import { InitiativeService } from './initiative.service'
import { JwtService } from '@nestjs/jwt'

interface JwtData {
   sub: string
   name: string
   mod: number
   role: Role
   iat: number
   exp: number
}

@WebSocketGateway({
   cors: {
      origin: process.env.FRONTEND_BASE_URL,
   },
})
export class InitiativeGateway implements OnGatewayConnection {
   constructor(
      private readonly initiativeService: InitiativeService,
      private readonly jwtService: JwtService,
   ) {}

   @WebSocketServer()
   private server: Server

   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   async handleConnection(client: Socket, ...args: any[]) {
      console.log(`connection established: ${client.id}`)
      client.join('game')
      client.emit('receive_initiatives', await this.initiativeService.findAll())
   }

   @SubscribeMessage('roll')
   async handleRollInitiative(@MessageBody() rollDto: RollDto) {
      const jwtDecodedData = this.jwtService.decode(rollDto.token)
      const jwtDecodedObject = jwtDecodedData as JwtData

      const character: Character = {
         id: jwtDecodedObject.sub,
         name: jwtDecodedObject.name,
         mod: jwtDecodedObject.mod,
         role: jwtDecodedObject.role,
      }

      await this.initiativeService.create(character, rollDto.initiative)

      this.server
         .to('game')
         .emit('receive_initiatives', await this.initiativeService.findAll())
   }

   @SubscribeMessage('pass')
   async handlePassInitiative(@MessageBody() passDto: PassDto) {
      const jwtDecodedData = this.jwtService.decode(passDto.token)
      const jwtDecodedObject = jwtDecodedData as JwtData

      if (jwtDecodedObject.role !== Role.DM) return

      await this.initiativeService.pass(passDto.characterName)

      this.server
         .to('game')
         .emit('receive_initiatives', await this.initiativeService.findAll())
   }

   @SubscribeMessage('clear')
   async handleClearInitiatives(@MessageBody() clearDto: ClearDto) {
      const jwtDecodedData = this.jwtService.decode(clearDto.token)
      const jwtDecodedObject = jwtDecodedData as JwtData

      if (jwtDecodedObject.role !== Role.DM) return

      await this.initiativeService.clear()

      this.server
         .to('game')
         .emit('receive_initiatives', await this.initiativeService.findAll())
   }
}
