import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { LoginRequestDto, LoginResponseDto } from '../../domain/dtos/auth'
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { AUTH_SERVICE_NAME } from '../proto/auth.pb'

@Controller()
export class AuthsController {
  constructor(private readonly _ccmsLoginPorts: IccmsLoginPorts) {}

  @GrpcMethod(AUTH_SERVICE_NAME, 'CcmsLogin')
  ccmslogin(payload: LoginRequestDto): Promise<LoginResponseDto> {
    console.log('payload', payload)
    return this._ccmsLoginPorts.handle(payload)
  }
}
