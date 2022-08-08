import { IsMongoId } from 'class-validator'

export class FindOneCharacterDto {
   @IsMongoId()
   id: string
}
