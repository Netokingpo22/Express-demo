const { constants } = require('../constants');

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    let jsonResponse = {
        title: 'Server Error',
        message: err.message,
        stackTrace: err.stack
    };

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
            break;
    }

    res.status(statusCode).json(jsonResponse);
};

module.exports = errorHandler;