import { INestMicroservice, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'
import { join } from 'path'

import { AppModule } from './infrastructure/modules/app.module'
import { configApp } from './infrastructure/config/'
import {
  protobufPackage,
  AUTH_PACKAGE_NAME,
} from './infrastructure/proto/auth.pb'

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: process.env.MS_AUTH_URL,
        package: AUTH_PACKAGE_NAME,
        protoPath: join('node_modules/grpc-ms-proto/proto/auth.proto'),
        port: process.env.PORT,
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
