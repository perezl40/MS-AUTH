import { Global, Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'

// Service
import { AuthsService } from '../services/auths.service'

// Controller
import { AuthsController } from '../controllers/auths.controller'

// UseCase
import { CCMSLoginUseCase } from '../../use-cases/auth/ccmsLogin.useCase'

// Interface
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { config } from '../config'

@Global()
@Module({
  controllers: [AuthsController],
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [config.KEY],
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.auth.secret,
          signOptions: {
            expiresIn: configService.auth.expider,
          },
        }
      },
    }),
  ],
  exports: [
    IccmsLoginPorts,
    IauthService,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigType<typeof config>) => {
        return {
          secret: configService.auth.secret,
          signOptions: {
            expiresIn: configService.auth.expider,
          },
        }
      },
    }),
  ],
  providers: [
    {
      provide: IauthService,
      useClass: AuthsService,
    },
    {
      provide: IccmsLoginPorts,
      useClass: CCMSLoginUseCase,
    },
  ],
})
export class AuthsModule {}
