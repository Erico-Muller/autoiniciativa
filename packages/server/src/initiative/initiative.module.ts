import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { InitiativeGateway } from './initiative.gateway'
import { InitiativeService } from './initiative.service'

import { PrismaService } from '../database/prisma.service'

@Module({
   imports: [
      ConfigModule.forRoot(),
      JwtModule.register({
         secret: process.env.JWT_SECRET_KEY,
         signOptions: { expiresIn: `${24 * 7}h` },
      }),
   ],
   providers: [InitiativeService, PrismaService, InitiativeGateway],
})
export class InitiativeModule {}
