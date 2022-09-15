import { IsJWT, IsString } from 'class-validator'

export class KillDto {
   @IsJWT()
   token: string

   @IsString()
   characterName: string
}
