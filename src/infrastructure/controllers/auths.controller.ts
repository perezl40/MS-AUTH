import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import {
  LoginRequestDto,
  CcmsLoginResponse,
  AUTH_SERVICE_NAME,
} from '../../domain/dtos/auth'
import { IccmsLoginPorts } from '../../domain/ports/auth'

@Controller()
export class AuthsController {
  constructor(private readonly _ccmsLoginPorts: IccmsLoginPorts) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'CcmsLogin')
  ccmslogin(payload: LoginRequestDto): Promise<CcmsLoginResponse> {
    return this._ccmsLoginPorts.handle(payload)
  }
}
