import { IsJWT, IsInt } from 'class-validator'

export class RollDto {
   @IsJWT()
   token: string

   @IsInt()
   initiative: number
}
