import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { CharacterController } from './character.controller'
import { CharacterService } from './character.service'
import { PrismaService } from '../database/prisma.service'
import { AuthService } from '../auth/auth.service'

@Module({
   imports: [
      ConfigModule.forRoot(),
      JwtModule.register({
         secret: process.env.JWT_SECRET_KEY,
         signOptions: { expiresIn: `${24 * 7}h` },
      }),
   ],
   controllers: [CharacterController],
   providers: [CharacterService, PrismaService, AuthService],
   exports: [CharacterService],
})
export class CharacterModule {}
