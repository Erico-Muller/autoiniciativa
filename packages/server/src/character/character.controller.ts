import {
   Controller,
   Get,
   Post,
   Param,
   Body,
   Delete,
   Request,
   HttpCode,
   HttpException,
   HttpStatus,
   UseGuards,
} from '@nestjs/common'

import { CharacterService } from './character.service'

import { character as Character } from '@prisma/client'

import { FindOneCharacterDto } from './dto/find-one-character.dto'
import { CreateCharacterDto } from './dto/create-character.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { role as Role } from '@prisma/client'

@Controller('character')
export class CharacterController {
   constructor(private readonly characterService: CharacterService) {}

   @Get()
   async findAll(): Promise<Character[]> {
      return await this.characterService.findAll()
   }

   @Get(':id')
   async findOne(
      @Param() findOneCharacterDto: FindOneCharacterDto,
   ): Promise<Character> {
      try {
         return await this.characterService.findOne(findOneCharacterDto)
      } catch (err) {
         throw new HttpException(
            {
               statusCode: HttpStatus.NOT_FOUND,
               message: [err],
               error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
         )
      }
   }

   @Post()
   async create(
      @Body() createCharacterDto: CreateCharacterDto,
   ): Promise<Character> {
      try {
         return await this.characterService.create(createCharacterDto)
      } catch (err) {
         throw new HttpException(
            {
               statusCode: HttpStatus.BAD_REQUEST,
               message: [err],
               error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
         )
      }
   }

   @Delete()
   @HttpCode(204)
   @Roles(Role.CHARACTER)
   @UseGuards(JwtAuthGuard, RolesGuard)
   async remove(@Request() req): Promise<void> {
      try {
         return await this.characterService.remove({ id: req.user.id })
      } catch (err) {
         throw new HttpException(
            {
               statusCode: HttpStatus.NOT_FOUND,
               message: [err],
               error: 'Not Found',
            },
            HttpStatus.NOT_FOUND,
         )
      }
   }
}
