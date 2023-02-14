import * as Joi from 'joi'
import { Logger } from '@nestjs/common'

export const JoiValidationSchema = Joi.object({
  NODE_ENV: Joi.required(),
  PORT: Joi.number(),
  MS_API_GATEWAY: Joi.required(),
})

export const LoggerValidation = (objEnv: any, parent = ''): void => {
  for (const prop in objEnv) {
    const isParent = parent ? `${parent}.` : ''
    const key = `${isParent}${prop}`
    const value = objEnv[prop]

    if (typeof value === 'object' && !Array.isArray(value)) {
      LoggerValidation(value, key)
    } else {
      if (Array.isArray(value)) {
        value.forEach((item) => Logger.verbose(item, key))
      } else {
        Logger.verbose(value, key)
      }
    }
  }
}
