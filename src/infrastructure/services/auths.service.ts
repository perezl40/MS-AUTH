import { Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { status } from '@grpc/grpc-js'

import { CcmsLoginResponse, CcmsLoginRequest } from '../../domain/dtos/auth'
import { IauthService } from '../../domain/services/auth/iauth.service'
import {
  NotFoundMSException,
  InternalMSException,
  GenericMSException,
  UnaterizedMSException,
  PermissionDeniedMSException,
  BadRequestMSException,
} from '../../domain/dtos/exceptions/customErrorResponse'
@Injectable()
export class AuthsService implements IauthService {
  async ccmsLogin(
    loginRequestDto: CcmsLoginRequest,
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
    // return userResponseDto

    throw new BadRequestMSException('Error')
    throw new NotFoundMSException('no se encontro')
    throw new InternalMSException('Problemas con el servidor')
    throw new PermissionDeniedMSException('Permiso denegado')
    throw new UnaterizedMSException('no autorizado')
    throw new GenericMSException(
      'Error Personalizado',
      status.PERMISSION_DENIED,
    )
  }

  validateToken(): Promise<any> {
    throw new Error('Method not implemented.')
  }
  userChangeRole(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
