import { LoginResponseDto, LoginRequestDto } from 'src/domain/dtos/auth'

export abstract class IauthService {
  abstract ccmsLogin(
    loginRequestDto: LoginRequestDto,
  ): Promise<LoginResponseDto>

  abstract validateToken(): Promise<any>

  abstract userChangeRole(): Promise<any>
}
