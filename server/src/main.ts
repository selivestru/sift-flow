import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module.js'
import { configureApp } from './app.setup.js'
import { EnvConfig } from './config/env.config.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  configureApp(app)

  const config = app.get(ConfigService<EnvConfig, true>)
  const port = config.get('PORT', { infer: true })

  await app.listen(port)
}
await bootstrap()
