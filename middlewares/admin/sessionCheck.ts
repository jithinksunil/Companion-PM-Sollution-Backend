import ErrorResponse from "../../error/ErrorResponse";
import {reqType, resType} from "../../types/expressTypes"
export const adminSessionCheck = (req : reqType, res : resType, next : (err?:ErrorResponse|null) => void) => {
    if (req.session.admin) {
        next()
        console.log('session verified');
    } else {
        next(ErrorResponse.unauthorized())
    }
}
