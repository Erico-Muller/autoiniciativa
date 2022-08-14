import {
   Controller,
   Post,
   Param,
   HttpException,
   HttpStatus,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { CharacterService } from '../character/character.service'

import { FindOneCharacterDto } from '../character/dto/find-one-character.dto'

@Controller('auth')
export class AuthController {
   constructor(
      private authService: AuthService,
      private readonly characterService: CharacterService,
   ) {}

   @Post('get_token/:id')
   async getToken(
      @Param() findOneCharacterDto: FindOneCharacterDto,
   ): Promise<{ character_token: string }> {
      try {
         const character = await this.characterService.findOne(
            findOneCharacterDto,
         )

         return await this.authService.generateCharacterToken(character)
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
