import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AppModule } from './infrastructure/modules/app.module'
import { configApp, configSwagger } from './infrastructure/config/'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)

  app.setGlobalPrefix('api')
  configApp(app, configService)
  configSwagger(app)

  const port = configService.get<number>('AppConfiguration.port')
  Logger.verbose(
    `on port: ${port} with environment: ${process.env.NODE_ENV}`.toUpperCase(),
    'STARTUP',
  )

  await app.listen(port)
}
bootstrap()
