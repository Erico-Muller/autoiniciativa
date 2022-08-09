import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import { Strategy, ExtractJwt } from 'passport-jwt'

type Payload = {
   sub: string
   name: string
   mod: number
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   constructor() {
      super({
         jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
         ignoreExpiration: true,
         secretOrKey: process.env.JWT_SECRET_KEY,
      })
   }

   async validate(payload: Payload) {
      return {
         id: payload.sub,
         name: payload.name,
         mod: payload.mod,
      }
   }
}
