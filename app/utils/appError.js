class AppError extends Error{
    constructor(message, statusCode){
        super(message)

        this.statusCode = statusCode || 500
        this.status = false
        this.isOptional = true

        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError