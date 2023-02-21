import { ValidationPipe, INestMicroservice } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerValidation } from './joi.validation'

export function configApp(
  app: INestMicroservice,
  configService: ConfigService,
) {
  if (process.env.NODE_ENV !== 'prod')
    LoggerValidation(configService.get('AppConfiguration'))

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
}
