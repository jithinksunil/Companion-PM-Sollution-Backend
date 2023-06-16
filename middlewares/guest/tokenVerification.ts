import { updateGuest } from "../../dataBaserepository/guestRepository"
import { reqType, resType } from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const guestVerifyToken = async (req: reqType, res: resType, next: () => void) => {
    try {
        const guestToken: string = req.cookies.guestToken
        if (guestToken) {
            jwt.verify(guestToken, 'mySecretKeyForGuest', async (err, decoded) => {
                try {
                    if (err) {                        
                        await updateGuest(guestToken)
                        res.json({ guestTokenVerified: false, message: 'Full access expired' })
                    } else {
                        let remainingTime = decoded?.createdAt + (30 * 60 * 1000) - Date.now()
                        remainingTime = Math.floor(remainingTime / 1000 / 60)
                        if (remainingTime < 0) {
                            await updateGuest(guestToken)
                            return res.status(401).json({ guestTokenVerified: false, message: 'Full access expired' })
                        }
                        req.remainingTime = remainingTime
                        next()
                    }
                } catch (error) {
                    res.status(500).json({ guestTokenVerified: false, message: 'Internal error in the database ,try later' })
                }
            })
        } else {
            res.json({ guestTokenVerified: false, message: 'Login to continue' })
        }
    } catch (error) {
        res.status(500).json({ guestTokenVerified: false, message: 'Internal error in the server ,try later' })
    }
}
