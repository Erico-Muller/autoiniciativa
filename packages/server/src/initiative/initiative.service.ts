import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'
import {
   initiative as Initiative,
   character as Character,
} from '@prisma/client'

import { RollManyDto } from './dto/roll-many.dto'

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

   async createMany(rollManyDto: RollManyDto): Promise<void> {
      function rollDice() {
         const min = Math.ceil(21)
         const max = Math.floor(1)

         return Math.floor(Math.random() * (max - min)) + min
      }

      const existingInitiatives = await this.prismaService.initiative.findMany({
         where: {
            characterName: {
               startsWith: rollManyDto.name,
            },
         },
      })

      const nameIdMod = existingInitiatives ? existingInitiatives.length : 0

      const newInitiatives = []
      for (let i = 1; i <= rollManyDto.quantity; i++) {
         const diceRes = rollDice()

         const initiative = {
            characterName:
               rollManyDto.quantity === 1 && existingInitiatives.length === 0
                  ? rollManyDto.name
                  : `${rollManyDto.name} ${i + nameIdMod}`,
            initiative: diceRes + rollManyDto.mod,
            is_critical: diceRes === 20 ? true : false,
            is_turn: false,
         }

         newInitiatives.push(initiative)
      }

      await this.prismaService.initiative.createMany({
         data: newInitiatives,
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
