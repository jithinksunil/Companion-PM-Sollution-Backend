import express from 'express'

export type reqType = express.Request & {
    session?: any,
    remainingTime?:number
    superUser?:any
}

export type resType = express.Response
