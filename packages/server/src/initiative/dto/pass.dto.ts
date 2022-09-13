import { IsJWT, IsString } from 'class-validator'

export class PassDto {
   @IsJWT()
   token: string

   @IsString()
   characterName: string
}
