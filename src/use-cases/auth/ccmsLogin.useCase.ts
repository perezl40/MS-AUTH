import { Injectable } from '@nestjs/common'

import { LoginRequestDto, LoginResponseDto } from '../../domain/dtos/auth'
import { IccmsLoginPorts } from '../../domain/ports/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'

@Injectable()
export class CCMSLoginUseCase implements IccmsLoginPorts {
  constructor(private readonly _authsService: IauthService) {}

  async handle(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    return await this._authsService.ccmsLogin(loginRequestDto)
  }
}
