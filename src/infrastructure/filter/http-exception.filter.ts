import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const status: HttpStatus = exception.getStatus()

    if (status === HttpStatus.BAD_REQUEST) {
      return {}
    }
  }
}
