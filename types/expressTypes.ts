import express from 'express'

export type reqType = express.Request & {
    session?: any
}
export type resType = express.Response
