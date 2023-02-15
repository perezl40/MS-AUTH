import { Module } from '@nestjs/common'

// Service
import { AuthsService } from '../services/auths.service'

// Controller
import { AuthsController } from '../controllers/auths.controller'

// UseCase
import { CCMSLoginUseCase } from '../../use-cases/auth/ccmsLogin.useCase'

// Interface
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'

@Module({
  controllers: [AuthsController],
  imports: [],
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
