import { CcmsLoginRequest, CcmsLoginResponse } from '../../dtos/auth/'

export abstract class IccmsLoginPorts {
  abstract handle(loginRequestDto: CcmsLoginRequest): Promise<CcmsLoginResponse>
}
