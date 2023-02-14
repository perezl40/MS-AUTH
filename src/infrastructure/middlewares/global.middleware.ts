import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  use(req: Request, response: Response, next: NextFunction) {
    response.charset = 'utf-8'
    const name = 'MS_AUTH'
    response.setHeader('server', name)
    response.setHeader('original-server', name)

    next()
  }
}
