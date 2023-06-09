import { reqType, resType } from "../../types/expressTypes"
import  { findAllConnections, messageSend, messagesAndChatDetails } from "../../dataBaserepository/chatRepository"

const chatController = {
    connnectionList: (req: reqType, res: resType) => {
        const superUserId = req.body.superUserId
        findAllConnections(superUserId).then((connections) => {
            res.json({ connections })

        }).catch(() => {
            res.json({ message: 'issues faced in data base while fetching connections' })
        })
    },
    startChat: (req: reqType, res: resType) => {
        let { senderId, recieverId } = req.body
        if (senderId !== recieverId) {
            messagesAndChatDetails(senderId, recieverId).then((result) => {
                res.json(result)
            }).catch(() => {
                res.json({ errorMessage: 'messages cannot be fetchnow due to database issues' })
            })
        }
        else {
            res.json({ messages: [] })
        }
    },
    sendMessage: (req: reqType, res: resType) => {
        messageSend(req.body).then((messages)=>res.json({ messages })).catch(()=>{
            res.json({ message: 'issues faced in data base while sending messages' })
        })
    }
}

export default chatController
