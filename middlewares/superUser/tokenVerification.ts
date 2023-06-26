import ErrorResponse from "../../error/ErrorResponse";
import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const superUserVerifyToken = (req : reqType, res : resType, next : (err?:ErrorResponse) => void) => {
    const superUserToken: string = req.cookies.superUserToken
    console.log(superUserToken);
    
    if (superUserToken) {

        jwt.verify(superUserToken, 'mySecretKeyForSuperUser', (err, decoded) => {
            if (err) {
                next(ErrorResponse.forbidden('Failed to varify supreUser token'))
            } else {
                console.log('SupreUser Token Verified')
                next()
            }
        })
    } else {
        next(ErrorResponse.unauthorized('Un-authorised access'))
    }
}
