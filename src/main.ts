import { INestMicroservice, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { AppModule } from './infrastructure/modules/app.module'
import { configApp } from './infrastructure/config/'
import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from './domain/dtos/auth/'

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      name: AUTH_SERVICE_NAME,
      options: {
        url: process.env.MS_API_GATEWAY,
        package: AUTH_PACKAGE_NAME,
        protoPath: join('node_modules/grpc-ms-proto/proto/auth.proto'),
        port: 5001,
      },
    },
  )

  const configService = app.get(ConfigService)

  configApp(app, configService)

  Logger.verbose(
    `Microservice run with environment: ${process.env.NODE_ENV}`.toUpperCase(),
    'STARTUP',
  )

  await app.listen()
}
bootstrap()
