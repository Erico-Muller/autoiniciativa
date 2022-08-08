import { IsString, IsInt } from 'class-validator'

export class CreateCharacterDto {
   @IsString()
   name: string

   @IsInt()
   mod: number
}
