import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module.js'
import { EnvConfig } from './config/env.config.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.set('trust proxy', 1)

  const config = app.get(ConfigService<EnvConfig, true>)

  app.enableCors({
    origin: config.get('ORIGIN', { infer: true }),
    credentials: true,
  })

  app.setGlobalPrefix('api')

  const port = config.get('PORT', { infer: true })

  await app.listen(port)
}
await bootstrap()
