import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const siteEngineerVerifyToken = (req : reqType, res : resType, next : () => void) => {
    const siteEngineerToken: string = req.cookies.siteEngineerToken
    if (siteEngineerToken) {

        jwt.verify(siteEngineerToken, 'mySecretKeyForSiteEngineer', (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({siteEngineerTokenVerified: false, message: 'Failed to varify site engineer token'})
            } else {
                console.log('site engineer Token Verified')
                next()
            }
        })
    } else {
        res.json({siteEngineerTokenVerified: false, message: 'Failed to varify site engineer token'})
    }
}
