class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {
    // Default error message and status code
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Handle Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);  // Status code should be 400
    }

    // Handle JWT Errors
    if (err.name === "JsonWebTokenError") {
        const message = `Invalid JSON Web Token, please try again`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Token Expired Error
    if (err.name === "TokenExpiredError") {
        const message = `Your JSON Web Token has expired, please log in again`;
        err = new ErrorHandler(message, 400);
    }

    // Handle Mongoose CastError (e.g., invalid ObjectId)
    if (err.name === "CastError") {
        const message = `Invalid ${err.path}: ${err.value}`;
        err = new ErrorHandler(message, 400);
    }

    const errorMessage = err.errors
        ? Object.values (err.errors)
            .map ((error) => error.message)
            .join (" ")
        : err.message

    // Send the final error response
    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
};

export default ErrorHandler;
