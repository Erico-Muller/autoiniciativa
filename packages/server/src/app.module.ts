import { Module } from '@nestjs/common'
import { CharacterModule } from './character/character.module'

@Module({
   imports: [CharacterModule],
})
export class AppModule {}
