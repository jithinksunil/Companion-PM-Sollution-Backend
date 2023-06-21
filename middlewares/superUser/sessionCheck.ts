import {reqType, resType} from "../../types/expressTypes"
export const superUserSessionCheck = (req : reqType, res : resType, next : () => void) => {
    if (req.session.superUser) {
        console.log('session verified');
        next()
    } else {
        console.log('session issue');
        
        res.json({message: "unautherised access- session expired"})
    }
}
