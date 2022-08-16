import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { CharacterController } from './character.controller'
import { CharacterService } from './character.service'
import { PrismaService } from '../database/prisma.service'

@Module({
   imports: [ConfigModule.forRoot()],
   controllers: [CharacterController],
   providers: [CharacterService, PrismaService],
   exports: [CharacterService],
})
export class CharacterModule {}
