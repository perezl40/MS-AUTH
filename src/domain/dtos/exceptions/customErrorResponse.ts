import { status } from '@grpc/grpc-js'
import { CustomExceptionDto } from './customExeption.dto'
import { RpcException } from '@nestjs/microservices'
import { HttpStatus } from '@nestjs/common'

export class CustomMSException extends RpcException {
  constructor(readonly customError: CustomExceptionDto, readonly code: number) {
    super({ code, message: JSON.stringify(customError) })
  }
}

export class NotFoundMSException extends CustomMSException {
  constructor(message: string) {
    const errorDetail = status.NOT_FOUND

    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}
export class BadRequestMSException extends CustomMSException {
  constructor(message: string) {
    const errorDetail = status.INVALID_ARGUMENT

    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}

export class InternalMSException extends CustomMSException {
  constructor(message: string) {
    const errorDetail = status.INTERNAL

    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}

export class UnaterizedMSException extends CustomMSException {
  constructor(message: string) {
    const errorDetail = status.UNAUTHENTICATED

    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}

export class PermissionDeniedMSException extends CustomMSException {
  constructor(message: string) {
    const errorDetail = status.PERMISSION_DENIED

    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}
export class GenericMSException extends CustomMSException {
  constructor(message: string, errorDetail: number) {
    const bodyError = new CustomExceptionDto(status[errorDetail], message)

    super(bodyError, errorDetail)
  }
}

export const ErrorForStatusHttp = (code: number, message: string) => {
  const error = new InternalMSException(message)
  const listHandlerError = {
    [HttpStatus.BAD_REQUEST]: new BadRequestMSException(message),
    [HttpStatus.NOT_FOUND]: new NotFoundMSException(message),
    [HttpStatus.INTERNAL_SERVER_ERROR]: error,
    [HttpStatus.UNAUTHORIZED]: new UnaterizedMSException(message),
    [HttpStatus.FORBIDDEN]: new PermissionDeniedMSException(message),
  }
  throw new listHandlerError[code]() || error
}
