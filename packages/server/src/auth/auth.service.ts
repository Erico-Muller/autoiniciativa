import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { character as Character } from '@prisma/client'

@Injectable()
export class AuthService {
   constructor(private readonly jwtService: JwtService) {}

   async generateCharacterToken(
      character: Character,
   ): Promise<{ character_token: string }> {
      const payload = {
         sub: character.id,
         name: character.name,
         mod: character.mod,
         role: character.role,
      }

      return {
         character_token: this.jwtService.sign(payload),
      }
   }
}
