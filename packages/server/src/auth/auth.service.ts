import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { character as Character, role as Role } from '@prisma/client'

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

   async validateToken(role: Role, type: Role): Promise<boolean> {
      if (!type) throw 'type must be a role'

      if (type === Role.CHARACTER) {
         if (role === Role.CHARACTER) return true
         else return false
      } else if (type === Role.DM) {
         if (role === Role.DM) return true
         else return false
      } else {
         throw 'type must be a role'
      }
   }
}
