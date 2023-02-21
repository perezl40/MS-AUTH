import { CcmsLoginResponse, CcmsLoginRequest } from 'src/domain/dtos/auth'

export abstract class IauthService {
  abstract ccmsLogin(
    loginRequestDto: CcmsLoginRequest,
  ): Promise<CcmsLoginResponse>

  abstract validateToken(): Promise<any>

  abstract userChangeRole(): Promise<any>
}
