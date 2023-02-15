import { LoginRequestDto, LoginResponseDto } from '../../dtos/auth/login.dto'

export abstract class IccmsLoginPorts {
  abstract handle(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto>
}
