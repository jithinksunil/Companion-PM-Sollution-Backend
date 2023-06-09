import { createNotification, getAllNotification } from "../../dataBaserepository/notificationRepository"
import { reqType, resType } from "../../types/expressTypes"

const notificationController = {
    notifications: (req: reqType, res: resType) => {
        const individual = req.body.individual
        let notifiedIndividualId = req.session[individual]._id
        getAllNotification(notifiedIndividualId).then((notifications) => {
            res.json({ notifications })
        }).catch(() => {
            res.json({ message: "data base facing issues to fetch the notifications now" })
        })
    },
    create: (req: reqType, res: resType) => {
        createNotification(req.body).then((status) => {
            res.json({ status, message: "notificaion send" })
        }).catch(() => {
            res.json({ message: "cannot save the notification right now" })
        })
    }
}

export default notificationController
