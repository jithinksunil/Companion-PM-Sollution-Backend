import { createAndGetGuest, findGuest } from "../../dataBaserepository/guestRepository";
import { reqType, resType } from "../../types/expressTypes";
import jwt from 'jsonwebtoken'

export const login = async (req: reqType, res: resType) => {
    try {
        let guestToken = req.cookies.guestToken
        let guest = await findGuest(guestToken)
        if (guest) {
            return res.status(200).json({ status: true, guest })
        }
        guestToken = jwt.sign({ name: 'guest',createdAt:Date.now()}, 'mySecretKeyForGuest', { expiresIn: '30m' })
        guest = await createAndGetGuest(guestToken)
        res.status(200).json({ status: true, guest, guestToken})
    } catch (err) {
        res.status(500).json({ status: false, message: 'Error on creating guest,try later' })
    }
}

export const dashboard = async(req: reqType, res: resType) => {

    res.status(200).json({ status: true,tokenVerified:true, message:`You have ${req.remainingTime} minutes remaining` })
}