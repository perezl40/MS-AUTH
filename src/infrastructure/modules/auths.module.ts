import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

// Service
import { AuthsService } from '../services/auths.service'

// Controller
import { AuthsController } from '../controllers/auths.controller'

// UseCase
import { CCMSLoginUseCase } from '../../use-cases/auth/ccmsLogin.useCase'

// Interface
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'
import { AUTH_SERVICE_NAME, AUTH_PACKAGE_NAME } from '../proto/auth.pb'

@Module({
  controllers: [AuthsController],
  imports: [
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: process.env.MS_AUTH_URL,
          package: AUTH_PACKAGE_NAME,
          protoPath: 'node_modules/grpc-ms-proto/proto/auth.proto',
        },
      },
    ]),
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
  exports: [IccmsLoginPorts, IauthService],
})
export class AuthsModule {}
