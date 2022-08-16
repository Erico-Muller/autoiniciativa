import { Injectable } from '@nestjs/common'

import { PrismaService } from '../database/prisma.service'

import { character as Character } from '@prisma/client'
import { role as Role } from '@prisma/client'

import { FindOneCharacterDto } from './dto/find-one-character.dto'
import { CreateCharacterDto } from './dto/create-character.dto'
import { DeleteCharacterDto } from './dto/delete-character.dto'
import { LoginDmDto } from './dto/login-dm.dto'

@Injectable()
export class CharacterService {
   constructor(private readonly prismaService: PrismaService) {}

   async findAll(): Promise<Character[]> {
      return await this.prismaService.character.findMany()
   }

   async findOne({ id }: FindOneCharacterDto): Promise<Character> {
      try {
         return await this.prismaService.character.findUniqueOrThrow({
            where: { id },
         })
      } catch (err) {
         throw 'character does not exists'
      }
   }

   async create({ name, mod }: CreateCharacterDto): Promise<Character> {
      if (name.length > 15) throw 'name exceeds the max lenght'
      if (mod > 20) throw 'mod exceeds the max'
      if (mod < -10) throw 'mod is too low'

      return await this.prismaService.character.create({
         data: {
            name,
            mod,
         },
      })
   }

   async remove({ id }: DeleteCharacterDto): Promise<void> {
      try {
         await this.prismaService.character.delete({
            where: { id },
         })
      } catch (err) {
         throw 'character does not exists'
      }
   }

   async loginDM({ password }: LoginDmDto): Promise<Character> {
      if (password === process.env.DM_PASS) {
         return await this.prismaService.character.create({
            data: {
               name: 'dm',
               mod: 0,
               role: Role.DM,
            },
         })
      } else {
         throw 'wrong password'
      }
   }
}
