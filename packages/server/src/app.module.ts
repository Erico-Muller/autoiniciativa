import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { CharacterModule } from './character/character.module'

@Module({
   imports: [AuthModule, CharacterModule],
})
export class AppModule {}
