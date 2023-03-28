import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const superUserVerifyToken = (req : reqType, res : resType, next : () => void) => {
    const superUserToken: string = req.cookies.superUserToken
    
    
    if (superUserToken) {

        jwt.verify(superUserToken, 'mySecretKeyForSuperUser', (err, decoded) => {
            if (err) {
                console.log(err);
                req.session.destroy()
                res.json({superUserTokenVerified: false, message: 'Failed to varify supreUser token'})
            } else {
                console.log('SupreUser Token Verified')

                next()
            }
        })
    } else {
        req.session.destroy()
        res.json({superUserTokenVerified: false, message: 'Failed to varify supreUser token'})
    }
}
