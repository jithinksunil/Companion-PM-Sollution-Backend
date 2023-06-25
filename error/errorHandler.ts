import { reqType, resType } from "../types/expressTypes"
import ErrorResponse from "./ErrorResponse"

const errorHandler=(err: ErrorResponse, req: reqType, res: resType, next: () => void) => {//error handling middle-ware
    if (err instanceof ErrorResponse) {
        res.status(err.status).json({message:err.message})
    }
    else {
        res.status(500).json()
    }
}
export default errorHandler