import {reqType, resType} from "../../types/expressTypes"
export const adminSessionCheck = (req : reqType, res : resType, next : () => void) => {
    if (req.session.admin) {
        next()
        console.log('session verified');
    } else {
        res.json({message: 'unautherised access- session expired'})
        req.session.destroy()
    }
}
