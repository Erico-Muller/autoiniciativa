import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'

import helmet from 'helmet'
import * as cookieParser from 'cookie-parser'
import * as compression from 'compression'

import { AppModule } from './app.module'

async function bootstrap() {
   const app = await NestFactory.create(AppModule)

   app.useGlobalPipes(new ValidationPipe())
   app.use(cookieParser(process.env.COOKIE_SECRET_KEY))
   app.use(helmet())
   app.use(compression())

   app.enableCors({
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
   })

   await app.listen(4000)
}
bootstrap()
