import { registerAs } from '@nestjs/config'

export const config = registerAs('AppConfiguration', () => ({
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'dev',
  msApiGateway: {
    url: process.env.MS_API_GATEWAY,
  },
}))
