import {reqType, resType} from "../../types/expressTypes"
export const superUserSessionCheck = (req : reqType, res : resType, next : () => void) => {
    if (req.session.superUser) {
        console.log('session verified');
        next()
    } else {
        res.json({message: "unautherised access- session expired"})
        req.session.destroy()
    }
}
