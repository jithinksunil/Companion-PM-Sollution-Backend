import {reqType, resType} from "../../types/expressTypes"
import jwt from 'jsonwebtoken'
import cloudinary from '../../config/cloudinaryConfig'
import projectManagerCollection from "../../models/projectManagerSchema"

const projectManagerController = {
    verifyToken: (req : reqType, res : resType) => {
        res.json({projectManagerTokenVerified: true})
    },
    signUp: (req : reqType, res : resType) => { // any data can be recieved now so must be validated befor saving to database
        projectManagerCollection.insertMany([req.body]).then(() => {
            res.json({status: true})
        }).catch(() => {
            res.json({status: false})
        })
    },
    logIn: (req : reqType, res : resType) => {

        const password = req.body.password
        const logginUserName = req.body.firstField

        projectManagerCollection.findOne({logginUserName}).then((projectManager) => {

            if (projectManager) {
                if (password === projectManager.password) {
                    req.session.projectManager = projectManager.toObject() // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const projectManagerData = projectManager.toObject()
                    const token = jwt.sign(projectManagerData, 'mySecretKeyForProjectManager', {expiresIn: '1h'})
                    res.json({verified: true, projectManager, message: 'Succesfully logged in', token})
                } else {
                    res.json({verified: false, message: 'Wrong email or password'})
                }
            } else {
                res.json({verified: false, message: 'User does not exist'})
            }
        }).catch((reject : Error) => {
            console.log(reject)
            res.json({verified: false, message: 'Sorry for Interuption ,Database facing issues'})
        })

    },
    projectManagerDashBoard: (req : reqType, res : resType) => {
        const projectManagerData = req.session.projectManager
        res.json({projectManagerTokenVerified: true, projectManagerData})
    },
    projectManagerProfile: (req : reqType, res : resType) => {

        projectManagerCollection.findOne({_id: req.session.projectManager._id}).then((projectManagerData) => {
            res.json({projectManagerTokenVerified: true, projectManagerData})
        }).catch(() => {
            res.json({projectManagerTokenVerified: true, message: 'Cannot fetch data now data base issue'})
        })
    },
    updateImage: (req : reqType, res : resType) => {
        const userId = req.session.projectManager._id
        if (req.file) {
            cloudinary.uploader.upload(req.file.path, {
                transformation: [
                    {
                        width: 485,
                        height: 485,
                        gravity: "face",
                        crop: "fill"
                    }
                ]
            }).then((result) => {
                projectManagerCollection.updateOne({
                    _id: userId
                }, {image: result.secure_url}).then(() => {
                    res.json({staus: true, message: 'successfully updated'})
                }).catch(() => {
                    res.json({staus: false, message: 'data base facing issue try later'})
                })
            }).catch((err) => {

                res.json({status: false, message: 'cannot upload now to cloudinary'})
            })

        } else {
            res.json({status: false, message: 'Select a jpeg format'})
        }

    },

}

type connectionType = {
    logginUserName: string,
    password: number
}

export default projectManagerController
