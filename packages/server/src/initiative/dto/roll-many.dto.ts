import { IsJWT, IsString, IsInt } from 'class-validator'

export class RollManyDto {
   @IsJWT()
   token: string

   @IsString()
   name: string

   @IsInt()
   mod: number

   @IsInt()
   quantity: number
}
