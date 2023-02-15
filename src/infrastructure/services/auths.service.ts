import { Injectable } from '@nestjs/common'

import { LoginRequestDto } from '../../domain/dtos/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'
import { CcmsLoginResponse } from '../proto/auth.pb'
@Injectable()
export class AuthsService implements IauthService {
  async ccmsLogin(
    loginRequestDto: LoginRequestDto,
  ): Promise<CcmsLoginResponse> {
    const userResponseDto: CcmsLoginResponse = {
      idccms: 111111,
      username: loginRequestDto.username,
      name: 'name',
      charge: 'charge',
      rol: 'rol',
      photo: 'photo',
      token: loginRequestDto.accessToken,
    }

    return userResponseDto
  }

  validateToken(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  userChangeRole(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
