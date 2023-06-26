import express from 'express'

export type reqType = express.Request & {
    session?: any,
    remainingTime?:number
}

export type resType = express.Response
