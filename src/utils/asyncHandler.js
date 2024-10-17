const DEFAULT_STATUS_CODE = 500;
const DEFAULT_ERROR_MESSAGE = "An error occurred";

/**
 * CustomError is a class that extends the built-in Error class in JavaScript to provide custom error handling.
 * It takes a message and a status code as parameters and sets them on the error object.
 * If no message or status code is provided, it defaults to "An error occurred" and 500 respectively.
 *
 * @class
 * @extends {Error}
 */
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message || DEFAULT_ERROR_MESSAGE);
        this.statusCode = statusCode || DEFAULT_STATUS_CODE;
    }
}

/**
 * customThrowErrorFn is a function that throws a custom error with a specific message and status code.
 *
 * @param {string} message - The error message to be displayed.
 * @param {number} statusCode - The HTTP status code associated with the error.
 *
 * @throws {CustomError} - Throws an instance of the CustomError class with the provided message and status code.
 *
 * @example
 * customThrowErrorFn('Not found', 404);
 */
const customThrowErrorFn = function (message, statusCode) {
    throw new CustomError(message, statusCode);
};

/**
 * asyncHandler is a middleware function that handles errors in the application.
 * It attaches the customThrowErrorFn to the response object, allowing routes to throw custom errors.
 * If an error is caught, it logs the error and sends a JSON response with the error message and status code.
 * If the error is not an instance of CustomError, it creates a new instance of CustomError with the error's message and status code.
 *
 * @param {Function} controllerFn - The function to be wrapped with error handling.
 * @returns {Function} - The wrapped function.
 *
 * Note: It is only required to wrap the outer controller function only.
 * 
 * @example
 * const getChatSession = asyncHandler(async (req, res, next) => {
 *     const { chatSessionId } = req.params;
 *     const chatSession = await ChatSession.findById(chatSessionId);
 *     if (!chatSession) {
 *         res.throwError("No chat history found", 404);
 *     } else {
 *         res.status(200).json({
 *             success: true,
 *             chatSession,
 *         });
 *     }
 * });
 */
const asyncHandler = controllerFn => async (req, res, next) => {
    try {
        res.throwError = customThrowErrorFn;
        await controllerFn(req, res, next)
    } catch (error) {
        // console.log(error);

        if (!(error instanceof CustomError)) {
            error = new CustomError(error.message, error.statusCode);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = asyncHandler;
