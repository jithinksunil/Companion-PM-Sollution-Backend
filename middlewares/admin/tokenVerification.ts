import ErrorResponse from "../../error/ErrorResponse"
import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const adminVerifyToken = (req : reqType, res : resType, next : (err?:ErrorResponse) => void) => {
    const adminToken: string = req.cookies.adminToken
    if (adminToken) {
        jwt.verify(adminToken, 'mySecretKeyForAdmin', (err, decoded) => {
            if (err) {
                next(ErrorResponse.forbidden('Admin token verification failed'))
            } else {
                console.log('Admin token Verified');
                next()
            }
        })
    } else {
        next(ErrorResponse.unauthorized())
    }
}
