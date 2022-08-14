import { Module } from '@nestjs/common'

import { AuthModule } from './auth/auth.module'
import { CharacterModule } from './character/character.module'
import { DmModule } from './dm/dm.module'

@Module({
   imports: [AuthModule, CharacterModule, DmModule],
})
export class AppModule {}
