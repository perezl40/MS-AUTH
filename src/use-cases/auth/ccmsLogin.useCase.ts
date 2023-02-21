import { Injectable } from '@nestjs/common'

import { CcmsLoginRequest, CcmsLoginResponse } from '../../domain/dtos/auth'
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'

@Injectable()
export class CCMSLoginUseCase implements IccmsLoginPorts {
  constructor(private readonly _authsService: IauthService) {}

  async handle(loginRequestDto: CcmsLoginRequest): Promise<CcmsLoginResponse> {
    return await this._authsService.ccmsLogin(loginRequestDto)
  }
}
