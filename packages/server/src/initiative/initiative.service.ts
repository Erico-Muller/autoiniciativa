import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'
import {
   initiative as Initiative,
   character as Character,
} from '@prisma/client'

@Injectable()
export class InitiativeService {
   constructor(private readonly prismaService: PrismaService) {}

   async findAll(): Promise<Initiative[]> {
      return await this.prismaService.initiative.findMany()
   }

   async create(character: Character, initiative: number): Promise<void> {
      const initiativeExists = await this.prismaService.initiative.findUnique({
         where: {
            characterName: character.name,
         },
      })

      if (initiativeExists) throw 'initiative already exists'

      await this.prismaService.initiative.create({
         data: {
            characterName: character.name,
            initiative: initiative + character.mod,
            is_critical: initiative === 20,
            is_turn: false,
         },
      })
   }

   async pass(characterName: string): Promise<void> {
      await this.prismaService.initiative.updateMany({
         where: {
            is_turn: true,
         },
         data: {
            is_turn: false,
         },
      })

      await this.prismaService.initiative.update({
         where: {
            characterName,
         },
         data: {
            is_turn: true,
         },
      })
   }

   async clear(): Promise<void> {
      await this.prismaService.initiative.deleteMany()
   }
}
