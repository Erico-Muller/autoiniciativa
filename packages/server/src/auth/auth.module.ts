import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './strategies/jwt.strategy'

import { AuthService } from './auth.service'

@Module({
   imports: [
      ConfigModule.forRoot(),
      PassportModule,
      JwtModule.register({
         secret: process.env.JWT_SECRET_KEY,
         signOptions: { expiresIn: `${24 * 7}h` },
      }),
   ],
   providers: [AuthService, JwtStrategy],
   exports: [AuthService],
})
export class AuthModule {}
