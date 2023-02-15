import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { environments, config, JoiValidationSchema } from '../config'
import { GlobalMiddleware } from '../middlewares/global.middleware'
import { AuthsModule } from './auths.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: environments[process.env.NODE_ENV] || environments.dev,
      load: [config],
      validationSchema: JoiValidationSchema,
      isGlobal: true,
    }),
    AuthsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
