import {
   Controller,
   Post,
   Request,
   Query,
   HttpException,
   HttpStatus,
   UseGuards,
} from '@nestjs/common'

import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

import { role as Role } from '@prisma/client'

@Controller('auth')
export class AuthController {
   constructor(private readonly authService: AuthService) {}

   @Post('validate_token')
   @UseGuards(JwtAuthGuard)
   async validateToken(
      @Request() req,
      @Query() { type }: { type: Role },
   ): Promise<any> {
      try {
         return await this.authService.validateToken(req.user.role, type)
      } catch (err) {
         throw new HttpException(
            {
               statusCode: HttpStatus.BAD_REQUEST,
               message: [err],
               error: 'Bad Request',
            },
            HttpStatus.BAD_REQUEST,
         )
      }
   }
}
