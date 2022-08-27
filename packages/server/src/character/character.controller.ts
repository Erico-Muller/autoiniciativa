import {
   Controller,
   Get,
   Post,
   Res,
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
import { AuthService } from '../auth/auth.service'

import { character as Character } from '@prisma/client'

import { FindOneCharacterDto } from './dto/find-one-character.dto'
import { CreateCharacterDto } from './dto/create-character.dto'
import { LoginDmDto } from './dto/login-dm.dto'

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'

import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { role as Role } from '@prisma/client'

@Controller('character')
export class CharacterController {
   constructor(
      private readonly characterService: CharacterService,
      private readonly authService: AuthService,
   ) {}

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
      @Res({ passthrough: true }) response,
   ): Promise<Character> {
      try {
         const character = await this.characterService.create(
            createCharacterDto,
         )

         const { character_token: token } =
            await this.authService.generateCharacterToken(character)
         response.cookie('jwt', token, { httpOnly: true, secure: true })

         return character
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
   @Roles(Role.CHARACTER, Role.DM)
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

   @Post('login_dm')
   async loginDM(
      @Body() loginDmDto: LoginDmDto,
      @Res({ passthrough: true }) response,
   ): Promise<Character> {
      try {
         const dm = await this.characterService.loginDM(loginDmDto)

         const { character_token: token } =
            await this.authService.generateCharacterToken(dm)
         response.cookie('jwt', token, { httpOnly: true, secure: true })

         return dm
      } catch (err) {
         throw new HttpException(
            {
               statusCode: HttpStatus.FORBIDDEN,
               message: [err],
               error: 'Forbidden',
            },
            HttpStatus.FORBIDDEN,
         )
      }
   }
}
