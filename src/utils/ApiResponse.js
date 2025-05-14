class ApiResponse {
    constructor(statusCode, data, message = "Success",token){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        if(token){
            this.token=token
        }
        this.success = statusCode < 400
      
    }
}

export { ApiResponse }
