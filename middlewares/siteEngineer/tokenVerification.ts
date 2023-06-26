import ErrorResponse from "../../error/ErrorResponse"
import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const siteEngineerVerifyToken = (req : reqType, res : resType, next : (err?:ErrorResponse) => void) => {
    const siteEngineerToken: string = req.cookies.siteEngineerToken
    if (siteEngineerToken) {

        jwt.verify(siteEngineerToken, 'mySecretKeyForSiteEngineer', (err, decoded) => {
            if (err) {
                console.log(err);
                next(ErrorResponse.forbidden('Failed to varify site engineer token'))
            } else {
                console.log('site engineer Token Verified')
                next()
            }
        })
    } else {
        next(ErrorResponse.unauthorized('Failed to varify site engineer token'))
    }
}
