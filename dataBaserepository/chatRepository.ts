import { Types } from "mongoose"
import projectManagerCollection from "../models/projectManagerSchema"
import siteEngineerCollection from "../models/siteEngineerSchema"
import superUserCollection from "../models/superUserSchema"
import conversationCollection from "../models/conversationShema"
import messageCollection from "../models/messageShema"

const chatHelpers = {
    findAllConnections: async (connections: any[], superUserId: any) => {
        try {
            let projectmanagers = await projectManagerCollection.find({ superUserId: new Types.ObjectId(superUserId) })
            connections = projectmanagers
            let siteEngineers = await siteEngineerCollection.find({ superUserId: new Types.ObjectId(superUserId) })
            connections = [...connections, ...siteEngineers]
            let superUser = await superUserCollection.findOne({ _id: new Types.ObjectId(superUserId) })
            return Promise.resolve([...connections, superUser])
        } catch (error) {
            return Promise.reject(error)
        }
    },
    messagesAndChatDetails: async (senderId: any, recieverId: any) => {

        try {
            senderId = new Types.ObjectId(senderId)
            recieverId = new Types.ObjectId(recieverId)
            let conversation = await conversationCollection.findOne({ members: { $all: [senderId, recieverId] } })
            if (!conversation) {
                await conversationCollection.insertMany([{ members: [senderId, recieverId] }])
            }
            conversation = await conversationCollection.findOne({ members: [senderId, recieverId] })
            if (conversation) {//conversation can possibly null
                const messages = await messageCollection.find({ conversationId: conversation._id })
                return Promise.resolve({ messages, recieverId, conversationId: conversation._id })
            } else {
                return Promise.resolve({ messages: [] })
            }
        } catch (error) {
            return Promise.reject(error)
        }

    },
    messageSend: async (messageObject: {conversationId:any}) => {
        try {
            messageObject.conversationId = new Types.ObjectId(messageObject.conversationId)
            await messageCollection.insertMany([messageObject])
            const messages = await messageCollection.find({ conversationId: messageObject.conversationId })
            return Promise.resolve(messages)
        } catch (error) {
            return Promise.reject(error)
        }
    }
}
export default chatHelpers