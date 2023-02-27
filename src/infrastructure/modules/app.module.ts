import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { environments, config, JoiValidationSchema } from '../config'
import { AuthsModule } from './auths.module'
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from '../filter/http-exception.filter'
import { DatabaseModule } from './database.module';
import { HttpModule } from '@nestjs/axios'

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || environments.dev,
      load: [config],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),
    AuthsModule,
    DatabaseModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
