import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const projectManagerVerifyToken = (req : reqType, res : resType, next : () => void) => {
    const projectManagerToken: string = req.cookies.projectManagerToken
    if (projectManagerToken) {

        jwt.verify(projectManagerToken, 'mySecretKeyForProjectManager', (err, decoded) => {
            if (err) {
                console.log(err);
                res.json({projectManagerTokenVerified: false, message: 'Failed to varify projectmanger token'})
            } else {
                console.log('Projectmanger Token Verified')
                next()
            }
        })
    } else {
        res.json({projectManagerTokenVerified: false, message: 'Failed to varify projectmanger token'})
    }
}
