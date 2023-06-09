import {reqType, resType} from "../../types/expressTypes"
import adminCollection from "../../models/adminSchema"
import superUserCollection from "../../models/superUserSchema"
import jwt from 'jsonwebtoken'

const adminController = {
    verifyToken: (req : reqType, res : resType) => {
        res.json({tokenVerified: true})
    },
    logIn: (req : reqType, res : resType) => {
        const password = req.body.password
        const email = req.body.email


        adminCollection.findOne({email}).then((admin) => {
            if (admin) {
                if (password === admin.password) {
                    req.session.admin = admin.toObject() // if we does not use toObject user will be having some other filed can only find by comparinf console.log(user);console.log(...user)
                    const adminData = admin.toObject()
                    const token = jwt.sign(adminData, 'mySecretKeyForAdmin', {expiresIn: '1h'})
                    res.json({verified: true, admin, message: 'Succesfully logged in', token})


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
    adminDashBoard: (req : reqType, res : resType) => {
        const adminData = req.session.admin
        res.json({tokenVerified: true, adminData})
    },
    adminProfile: (req : reqType, res : resType) => {
        const adminData = req.session.admin
        res.json({tokenVerified: true, adminData})
    },
    superUserManagement: (req : reqType, res : resType) => {
        let {search} = req.query
        if (!search) 
            search = ''
        superUserCollection.find({
            $or: [
                {
                    email: {
                        $regex: search,
                        $options: 'i'
                    }
                }, {
                    companyName: {
                        $regex: search,
                        $options: 'i'
                    }
                }
            ]
        }).then((superUsersData : any) => { // if(superUsersData.length==0){superUsersData=[{email:'nothing to display',companyName:'nothing to display',password:'nothing to display'}]}
            res.json({tokenVerified: true, superUsersData})
        }).catch(err => {

            console.log(err)
            res.json({tokenVerified: true, message: 'Sorry, connot retrieve datas now, Database facing issues'})
        })
    },
    blockOrUnblock: (req : reqType, res : resType) => {


        superUserCollection.updateOne({
            _id: req.query.id
        }, {status: req.query.status}).then(() => {
            res.json({action: true, message: 'updated'})
        }).catch((err) => {
            console.log(err)
            res.json({action: false, message: 'Sorry for connot retrieve datas now, Database facing issues'})
        })
    }
}

export default adminController
