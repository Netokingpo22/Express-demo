const { constants } = require('../constants');

const errorHandler = (err, req, res, next) => {
    // Determine the status code; use 500 if not defined
    const statusCode = res.statusCode || 500;

    // Define the basic JSON response
    let jsonResponse = {
        title: 'Server Error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stackTrace: err.stack }) // Only show stack trace in development
    };

    // Set the error title based on the status code
    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            jsonResponse.title = 'Validation Failed';
            break;
        case constants.UNAUTHORIZED:
            jsonResponse.title = 'Unauthorized';
            break;
        case constants.FORBIDDEN:
            jsonResponse.title = 'Forbidden';
            break;
        case constants.NOT_FOUND:
            jsonResponse.title = 'Not Found';
            break;
        default:
            jsonResponse.title = 'Server Error';
            break;
    }

    // Send the JSON response with the status code
    res.status(statusCode).json(jsonResponse);
};

module.exports = errorHandler;