import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { InitiativeService } from './initiative.service'
import { InitiativeGateway } from './initiative.gateway'
import { PrismaService } from '../database/prisma.service'

@Module({
   imports: [ConfigModule.forRoot()],
   providers: [InitiativeService, PrismaService, InitiativeGateway],
})
export class InitiativeModule {}
