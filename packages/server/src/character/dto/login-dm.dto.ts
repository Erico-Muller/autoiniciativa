import { IsString } from 'class-validator'

export class LoginDmDto {
   @IsString()
   password: string
}
