"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorResponse extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
    static badRequest(msg = 'Bad request') {
        return new ErrorResponse(400, msg);
    }
    static unauthorized(msg = 'Un-authorised access') {
        return new ErrorResponse(401, msg);
    }
    static forbidden(msg = 'Forbidden') {
        return new ErrorResponse(403, msg);
    }
    static notFound(msg = 'Not found') {
        return new ErrorResponse(404, msg);
    }
    static internalError(msg = 'Internal error') {
        return new ErrorResponse(500, msg);
    }
}
exports.default = ErrorResponse;
