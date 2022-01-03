interface ApiError {
  code: number
  error?: Error
  hasError: true
  message: string
}

class ApiError {
  public code: number
  public error?: Error
  public hasError: true
  public message: string

  constructor(message: string, code: number, error?: Error) {
    this.code = code
    this.error = error
    this.hasError = true
    this.message = message
  }
}

export default ApiError
