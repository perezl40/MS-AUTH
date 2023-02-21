export class CustomExceptionDto {
  type: string
  details: string
  domain: string

  constructor(type: string, details: string) {
    this.type = type
    this.details = details
    this.domain = MS_NAME.MS_AUTH
  }
}

enum MS_NAME {
  MS_AUTH = 'MS_AUTH',
}
