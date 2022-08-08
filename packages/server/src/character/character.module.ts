import { Module } from '@nestjs/common'

import { CharacterController } from './character.controller'
import { CharacterService } from './character.service'
import { PrismaService } from '../database/prisma.service'

@Module({
   controllers: [CharacterController],
   providers: [CharacterService, PrismaService],
})
export class CharacterModule {}
