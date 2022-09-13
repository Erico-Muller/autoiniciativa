import { IsJWT } from 'class-validator'

export class ClearDto {
   @IsJWT()
   token: string
}
