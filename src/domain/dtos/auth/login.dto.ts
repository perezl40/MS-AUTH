import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string

  @IsOptional()
  @IsString()
  readonly username: string
}

export class LoginResponseDto {
  idccms?: number

  username?: string

  name?: string

  charge?: string

  rol?: string

  photo?: string

  token?: string
}
