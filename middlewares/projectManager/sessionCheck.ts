import {reqType, resType} from "../../types/expressTypes"
export const projectManagerSessionCheck = (req : reqType, res : resType, next : () => void) => {
    if (req.session.projectManager) {
        next()
        console.log('session verified');
    } else {
        res.json({message: "unautherised access- session expired"})
    }
}
