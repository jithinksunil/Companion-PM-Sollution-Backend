import { updateGuest } from "../../dataBaserepository/guestRepository"
import ErrorResponse from "../../error/ErrorResponse"
import { reqType, resType } from "../../types/expressTypes"
import jwt from 'jsonwebtoken'
interface JwtPayload {
    createdAt: number
  }

export const guestVerifyToken = async (req: reqType, res: resType, next: (err?:ErrorResponse) => void) => {
    try {
        const guestToken: string = req.cookies.guestToken
        if (guestToken) {
            jwt.verify(guestToken, 'mySecretKeyForGuest', async (err, decoded) => {
                try {
                    if (err) {                        
                        await updateGuest(guestToken)
                        next(ErrorResponse.forbidden('Full access expired'))
                    } else {
                        const payload: JwtPayload = decoded as JwtPayload;
                        let remainingTime = payload?.createdAt + (30 * 60 * 1000) - Date.now()
                        remainingTime = Math.floor(remainingTime / 1000 / 60)
                        if (remainingTime < 0) {
                            await updateGuest(guestToken)
                            return next(ErrorResponse.forbidden('Full access expired'))
                        }
                        req.remainingTime = remainingTime
                        next()
                    }
                } catch (error) {
                    next(ErrorResponse.internalError('Internal error in the database ,try later'))
                }
            })
        } else {
            next(ErrorResponse.unauthorized('Login to continue'))
        }
    } catch (error) {
        next(ErrorResponse.internalError('Internal error'))
    }
}
