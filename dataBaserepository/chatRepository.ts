import { Types } from "mongoose"
import projectManagerCollection from "../models/projectManagerSchema"
import siteEngineerCollection from "../models/siteEngineerSchema"
import superUserCollection from "../models/superUserSchema"
import conversationCollection from "../models/conversationShema"
import messageCollection from "../models/messageShema"


export const findAllConnections = async ( superUserId: any) => {
    try {
        const projectmanagers = await projectManagerCollection.find({ superUserId: new Types.ObjectId(superUserId) })
        const siteEngineers = await siteEngineerCollection.find({ superUserId: new Types.ObjectId(superUserId) })
        const superUser = await superUserCollection.findOne({ _id: new Types.ObjectId(superUserId) })
        return Promise.resolve([...projectmanagers,...siteEngineers,superUser])
    } catch (error) {
        return Promise.reject(error)
    }
}
export const messagesAndChatDetails = async (senderId: any, recieverId: any) => {

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

}
export const messageSend = async (messageObject: { conversationId: any }) => {
    try {
        messageObject.conversationId = new Types.ObjectId(messageObject.conversationId)
        await messageCollection.insertMany([messageObject])
        const messages = await messageCollection.find({ conversationId: messageObject.conversationId })
        return Promise.resolve(messages)
    } catch (error) {
        return Promise.reject(error)
    }
}
