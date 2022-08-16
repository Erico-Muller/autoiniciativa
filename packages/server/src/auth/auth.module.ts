import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthService } from './auth.service'
import { CharacterService } from '../character/character.service'
import { PrismaService } from '../database/prisma.service'

@Module({
   imports: [
      ConfigModule.forRoot(),
      PassportModule,
      JwtModule.register({
         secret: process.env.JWT_SECRET_KEY,
         signOptions: { expiresIn: `${24 * 7}h` },
      }),
   ],
   providers: [AuthService, JwtStrategy, CharacterService, PrismaService],
   exports: [AuthService],
})
export class AuthModule {}
