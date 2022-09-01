import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { CharacterModule } from './character/character.module'
import { InitiativeModule } from './initiative/initiative.module'

@Module({
   imports: [
      ConfigModule.forRoot(),
      AuthModule,
      CharacterModule,
      InitiativeModule,
   ],
})
export class AppModule {}
