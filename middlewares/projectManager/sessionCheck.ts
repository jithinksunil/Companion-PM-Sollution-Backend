import ErrorResponse from "../../error/ErrorResponse";
import {reqType, resType} from "../../types/expressTypes"
export const projectManagerSessionCheck = (req : reqType, res : resType, next : (err?:ErrorResponse) => void) => {
    if (req.session.projectManager) {
        next()
        console.log('session verified');
    } else {
        next(ErrorResponse.unauthorized('Un-authorised access'))
    }
}
