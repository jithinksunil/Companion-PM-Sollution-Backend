import { Types } from "mongoose"
import notificationCollection from "../models/notificationCollection"


export const getAllNotification = async (notifiedIndividualId: any) => {
    try {
        let notifications = await notificationCollection.find({ notifiedIndividualId }).sort({ $natural: -1 })
        return Promise.resolve(notifications)
    } catch (error) {
        return Promise.reject(error)
    }
}

export const createNotification = async (requestObject: { notifiedIndividualId: any }) => {
    try {
        requestObject.notifiedIndividualId = new Types.ObjectId(requestObject.notifiedIndividualId)
        await notificationCollection.insertMany([requestObject])
        return Promise.resolve(true)
    } catch (error) {
        return Promise.reject(error)
    }
}