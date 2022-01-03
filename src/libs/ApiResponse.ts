interface ApiResponse<D = any> {
  data: D
  hasError: false
}

class ApiResponse<D = any> {
  public data: D
  public hasError: false

  constructor(data: D) {
    this.data = data
    this.hasError = false
  }
}

export default ApiResponse
