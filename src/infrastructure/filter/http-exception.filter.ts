import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const status: HttpStatus = exception.getStatus()

    if (status === HttpStatus.BAD_REQUEST) {
      const res: any = exception.getResponse()
      return {}
    }
  }
}
