import { registerAs } from '@nestjs/config'

export const config = registerAs('AppConfiguration', () => ({
  port: process.env.PORT || 3001,
  environment: process.env.NODE_ENV || 'dev',
  msApiGateway: {
    url: process.env.MS_API_GATEWAY,
  },
  connectionDataBase: {
    database: process.env.DATABASE,
    password: process.env.SQL_PASSWORD,
    user: process.env.SQL_USERNAME,
    instance: process.env.INSTANCE,
    host: process.env.IP_SQL
  },
  auth:{
    secret: process.env.SECRET_KEY,
    expider: process.env.EXPIRED_IN
  }
}));