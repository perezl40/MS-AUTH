import { IsNotEmpty, IsString, IsOptional } from 'class-validator'

export class CampaignsDto {
  id?: number
  campaign?: string
  powerBiName?: string
  powerBiURL?: string
  reportPowerBi?: string
}

export class LoginDto {
  idccms?: number
  username?: string
  name?: string
  charge?: string
  rol?: string
  photo?: string
  token?: string
}

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly accessToken: string

  @IsOptional()
  @IsString()
  readonly username: string
}

export class LoginResponseDto {
  login?: LoginDto
  campaigns?: CampaignsDto[]
}
