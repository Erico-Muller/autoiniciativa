import { IsMongoId } from 'class-validator'

export class DeleteCharacterDto {
   @IsMongoId()
   id: string
}
