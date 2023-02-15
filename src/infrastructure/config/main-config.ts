import { ValidationPipe, INestMicroservice } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LoggerValidation } from './joi.validation'
import { HttpExceptionFilter } from '../filter/http-exception.filter'

export function configApp(
  app: INestMicroservice,
  configService: ConfigService,
) {
  if (process.env.NODE_ENV !== 'prod')
    LoggerValidation(configService.get('AppConfiguration'))

  app.useGlobalFilters(new HttpExceptionFilter())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
}
