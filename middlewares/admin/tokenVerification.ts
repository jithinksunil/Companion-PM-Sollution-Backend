import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'

export const adminVerifyToken = (req : reqType, res : resType, next : () => void) => {
    const adminToken: string = req.cookies.adminToken
    if (adminToken) {
        jwt.verify(adminToken, 'mySecretKeyForAdmin', (err, decoded) => {
            if (err) {
                res.json({adminTokenVerified: false, message: 'Admin token verification failed'})
            } else {
                console.log('Admin token Verified');
                next()
            }
        })
    } else {
        res.json({adminTokenVerified: false, message: 'Admin token verification failed'})
    }
}
