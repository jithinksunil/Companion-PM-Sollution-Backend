class ErrorResponse extends Error {

    constructor(status:number, message:string) {
        super(message);
        this.status = status;
    }

    status:number
    
    static badRequest() {
        return new ErrorResponse(400, 'Bad request')
    }
    
    static unauthorized() {
        return new ErrorResponse(401, 'Un-authorised access');
    }
    
    static forbidden() {
        return new ErrorResponse(403, 'Forbidden');
    }
    
    static notFound() {
        return new ErrorResponse(404, 'Not found');
    }
    
    static internalError() {
        return new ErrorResponse(500, 'Internal error');
    }
}

export default ErrorResponse

