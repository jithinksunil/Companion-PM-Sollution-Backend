import ErrorResponse from "../../error/ErrorResponse"
import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const projectManagerVerifyToken = (req : reqType, res : resType, next : (err?:ErrorResponse) => void) => {
    const projectManagerToken: string = req.cookies.projectManagerToken
    if (projectManagerToken) {

        jwt.verify(projectManagerToken, 'mySecretKeyForProjectManager', (err, decoded) => {
            if (err) {
                console.log(err);
                next(ErrorResponse.forbidden('Failed to varify projectmanger token'))
            } else {
                console.log('Projectmanger Token Verified')
                next()
            }
        })
    } else {
        next(ErrorResponse.unauthorized('Failed to varify projectmanger token'))
    }
}
