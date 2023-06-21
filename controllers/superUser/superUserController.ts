import { reqType, resType } from "../../types/expressTypes"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'
import cloudinary from '../../config/cloudinaryConfig'
import { newConnectionObject, newConnectionMailObject, mailService } from "../../config/nodeMailer"
import projectManagerCollection from "../../models/projectManagerSchema"
import projectCollection, { projectDocument } from "../../models/projectSchema"
import { Types } from "mongoose"
import siteEngineerCollection from "../../models/siteEngineerSchema"
import taskCollection from "../../models/taskShema"

const superUseController = {
    verifyToken: (req: reqType, res: resType) => {
        const superUserData = req.session.superUser
        res.json({ tokenVerified: true, superUserData })
    },
    logout: (req: reqType, res: resType) => {
        req.session.destroy()
        res.json({ status: true, message: 'Succesfully Logged Out' })
    },
    signUp: async (req: reqType, res: resType) => { // any data can be recieved now so must be validated befor saving to database
        try {
            const { email } = req.body
            console.log(req.body);

            const superUserExist = await superUserCollection.findOne({ email })
            if (superUserExist) {
                res.json({ status: false, message: 'User already exist' })
            } else {
                superUserCollection.insertMany([req.body]).then(() => {
                    console.log('added');

                    res.json({ status: true, message: 'Signin Successfullllll' })
                }).catch(() => {
                    res.json({ status: false, message: 'Database facing issues' })
                })
            }
        }
        catch (err) {
            res.json({ status: false, message: 'Database facing issues' })
        }
    },
    logIn: (req: reqType, res: resType) => {

        const password = req.body.password
        const email = req.body.email

        superUserCollection.findOne({ email }).then((superUserData) => {
            if (superUserData) {
                if (password === superUserData.password) {
                    req.session.superUser = superUserData.toObject() // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const superUser = superUserData.toObject()
                    const token = jwt.sign(superUser, 'mySecretKeyForSuperUser', { expiresIn: '1h' })
                    res.json({ verified: true, data: superUser, message: 'Succesfully logged in', token })
                } else {
                    res.json({ verified: false, message: 'Wrong email or password' })
                }
            } else {
                res.json({ verified: false, message: 'User does not exist' })
            }
        }).catch((reject: Error) => {
            console.log(reject)
            res.json({ verified: false, message: 'Sorry for Interuption ,Database facing issues' })
        })

    },
    superUserDashBoard: (req: reqType, res: resType) => {
        console.log('reached');
        
        res.json({ tokenVerified: true })
    },
    superUserProfile: (req: reqType, res: resType) => {
        superUserCollection.findOne({ _id: req.session.superUser._id }).then((superUserData) => {
            const message=req.query.message
            res.json({ tokenVerified: true, data: superUserData,status:true,message })
        }).catch(() => {
            res.json({ tokenVerified: true, message: 'Cannot fetch data now data base issue' })
        })
    },
    updateImage: (req: reqType, res: resType) => {

        const userId = req.session.superUser._id
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
                superUserCollection.updateOne({
                    _id: userId
                }, { image: result.secure_url }).then(() => {
                    res.redirect('/profile?message=successfully updated')
                }).catch(() => {
                    res.json({ staus: false, message: 'data base facing issue try later' })
                })
            }).catch((err) => {

                res.json({ status: false, message: 'cannot upload now to cloudinary' })
            })

        } else {
            res.json({ status: false, message: 'Select a jpeg format' })
        }

    },
    updateProfile: (req: reqType, res: resType) => {
        const { name, email, companyName, password } = req.body
        if (req.session.superUser.password === password) {
            superUserCollection.findOneAndUpdate({ _id: req.session.superUser._id }, { $set: { name, email, companyName } }, { returnOriginal: false }).then((superUser) => {

                res.json({ status: true, message: 'Succesfully updated', data: superUser })
            }).catch(() => {
                res.json({ status: false, message: 'Cannot update database facing issues' })
            })
        }
        else {
            res.json({ status: false, message: 'Password does not matches' })
        }
    },
    connections: async (req: reqType, res: resType) => {

        const superUserId = new Types.ObjectId(req.session.superUser._id)
        const projectManagers = await projectManagerCollection.aggregate([{ $match: { superUserId } },
        {
            $lookup: {
                from: 'project_collections',
                let: { projectManagerId: '$_id' },
                pipeline: [{ $match: { $expr: { $in: ['$$projectManagerId', '$projectManagers.projectManagerId'] } } }, {
                    $project: {
                        name: 1, projectManagers: {
                            $filter: {
                                input: "$projectManagers",
                                as: "pm",
                                cond: {
                                    $and: [{ $eq: ["$$pm.projectManagerId", "$$projectManagerId"] },
                                    { $eq: ["$$pm.status", true] }]
                                }
                            }
                        }
                    }
                }, {
                    $match: { "projectManagers.status": true }
                }
                ],
                as: 'projects'
            }
        }])

        const data: any = {}
        projectManagers.forEach((item) => {
            data[item.name] = item.projects
        })

        const message = req.query.message
        res.json({ tokenVerified: true, data, message })

    },
    siteEngineerList: async (req: reqType, res: resType) => {
        const superUserId = new Types.ObjectId(req.session.superUser._id)
        const projects: any = await projectCollection.aggregate([{ $match: { superUserId } }, {
            $lookup: {
                from: 'site_engineer_collections',
                let: { projectId: '$_id' },
                pipeline: [{ $match: { $expr: { $in: ['$$projectId', "$projects.projectId"] } } }, {
                    $project: {
                        name: 1, projects: {
                            $filter: {
                                input: "$projects",
                                as: "project",
                                cond: {
                                    $and: [{ $eq: ["$$project.projectId", "$$projectId"] },
                                    { $eq: ["$$project.status", true] }]
                                }
                            }
                        }
                    }
                }, {
                    $match: { "projects.status": true }
                }],
                as: 'siteEngineers'
            },

        }])
        const unAssignedSiteEngineers = await siteEngineerCollection.aggregate([{ $match: { superUserId } }, {
            $project: {
                name: 1, projects: {
                    $filter: {
                        input: "$projects",
                        as: 'project',
                        cond: { $eq: ["$$project.status", true] }
                    }
                }
            }
        }, { $match: { projects: [] } }])
        console.log(unAssignedSiteEngineers);

        const data: any = {}
        data.unAssigned = unAssignedSiteEngineers
        projects.map((item: any) => {
            data[item.name] = item.siteEngineers
        })

        const message = req.query.message
        res.json({ tokenVerified: true, data, message })
    },
    siteEngineerAssignment: async (req: reqType, res: resType) => {
        const { startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex } = req.body
        const endProject = await projectCollection.findOne({ name: endColumn })
        const startProject = await projectCollection.findOne({ name: startColumn })
        const movingItemId = new Types.ObjectId(movingItem._id)
        if (startColumn !== endColumn) {
            if (startProject) {

                await siteEngineerCollection.updateOne({ _id: movingItemId, "projects.projectId": startProject._id }, { $set: { "projects.$.status": false, currentTaskOrder: [] } })
                await taskCollection.updateMany({ projectId: startProject._id, "siteEngineers.siteEngineerId": new Types.ObjectId(movingItemId) }, { $set: { "siteEngineers.$.status": false } })
                console.log(typeof (movingItemId));
                console.log(typeof (movingItem));


            }
            let siteEngineer
            if (endProject) {
                siteEngineer = await siteEngineerCollection.findOneAndUpdate({ _id: movingItemId, "projects.projectId": endProject._id }, { $set: { "projects.$.status": true } })
                if (!siteEngineer) {
                    await siteEngineerCollection.updateOne({ _id: movingItemId }, { $push: { projects: { projectId: endProject._id, status: true } } })

                }
            }
        }

        res.redirect('/siteengineerlist?message=Succesfully updated')
    },
    updateProjectAssingment: async (req: reqType, res: resType) => {
        try {
            const { startColumn, dragStartIndex, movingItem, endColumn, dragEnterIndex } = req.body
            const superUserId = new Types.ObjectId(req.session.superUser._id)
            const movingItemId = new Types.ObjectId(movingItem._id)

            const endProjectManager = await projectManagerCollection.findOne({ name: endColumn })
            const startProjectManager = await projectManagerCollection.findOne({ name: startColumn })

            if (startProjectManager) {

                await projectCollection.updateOne({ _id: movingItemId, "projectManagers.projectManagerId": startProjectManager._id }, { $set: { "projectManagers.$.status": false } })
            }

            let project
            if (endProjectManager) {
                project = await projectCollection.findOneAndUpdate({ _id: movingItemId, "projectManagers.projectManagerId": endProjectManager._id }, { $set: { "projectManagers.$.status": true } })
                if (!project) {
                    await projectCollection.updateOne({ _id: movingItemId }, { $push: { projectManagers: { projectManagerId: endProjectManager._id, status: true } } })

                }
            }

            if (endColumn == "unAssigned") {
                await siteEngineerCollection.updateMany({ superUserId, "projects.projectId": movingItemId }, { $set: { "projects.$.status": false, currentTaskOrder: [] } })
                await taskCollection.updateMany({ projectId: movingItemId, "siteEngineers.status": true }, { $set: { "siteEngineers.$.status": false } })
            }

            res.redirect('/connections?message=Succesfully updated')
        }
        catch (err) {
            res.json({ status: false, message: 'updation failed' })
        }

    },

    addConnection: (req: reqType, res: resType) => {
        const email = req.body.connection
        const position = req.body.designation
        console.log(req.body)

        if (email && position) {
            const { _id, companyName } = req.session.superUser
            const connectionObject: connectionType = newConnectionObject(companyName)
            const { logginUserName, password } = connectionObject
            const mailOptions = newConnectionMailObject(email, connectionObject)
            const name = email.split('@')
            const newConnectionData = {
                email,
                name: name[0],
                companyName,
                superUserId: _id,
                logginUserName,
                password,
                position
            }
            mailService(mailOptions).then(() => {
                if (position == 'projectManager') {
                    projectManagerCollection.insertMany([newConnectionData]).then(() => {
                        res.json({ status: true, message: 'Project manager added successfully' })
                    }).catch(() => {
                        res.json({ status: false, message: 'Connection cannot be added right now-database issue' })
                    })
                } else if (position == 'siteEngineer') {
                    siteEngineerCollection.insertMany([newConnectionData]).then(() => {
                        res.redirect('/connections?message=Site engineer added successfully')
                    }).catch(() => {
                        res.json({ status: false, message: 'Connection cannot be added right now-database issue' })
                    })
                }

            }).catch(() => {
                res.json({ status: false, message: 'Connection cannot be added right, nodemailer issue' })
            })

        } else {
            res.json({ status: false, message: 'Invalid email or designation' })
        }
    },
    paymentComplete: (req: reqType, res: resType) => {
        superUserCollection.updateOne({ _id: req.session.superUser._id }, { $set: { membership: req.body.plan } }).then(() => {
            res.json({ superUserToken: true, status: true, message: 'Your membership is updated' })
        }).catch(() => {
            res.json({ superUserToken: true, status: false, message: 'Cannot update the membership' })
        })
    }
}

type connectionType = {
    logginUserName: string,
    password: string
}

export default superUseController
