import nodemailer from 'nodemailer'

export function otp() {

    const otpgen = Math.floor(1000 + Math.random() * 9000)
    return otpgen

}

export function newConnectionObject(companyName : string) {

    const firstFourLetter = companyName.toUpperCase().substring(0, 4)
    const connectionSerial = Math.floor(1000 + Math.random() * 9000)
    const logginUserName = firstFourLetter + connectionSerial + 'CMPN'
    const password4Leters = Math.random().toString(36).substring(2, 7)
    const password4Digits = Math.floor(1000 + Math.random() * 9000)
    const password = password4Leters + password4Digits
    return {logginUserName, password}

}

export function OtpMailObject(email : string, otpgen : number) {

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'YOUR OTP',
        html: `<p>${otpgen}</p>`
    }
    return mailOptions
}
type connectionType = {
    logginUserName: string,
    password: string
}

export function newConnectionMailObject(email : string, data : connectionType) {

    const mailOptions = {
        from: process.env.NODE_MAILER_EMAIL,
        to: email,
        subject: 'Your Login Credentials',
        html: `<p>
        Your loggin user name:${
            data.logginUserName
        }<br>
        Your Password:${
            data.password
        }<br>
        Use the following link to loggin:<br>
        ${process.env.CORS_LINK}/projectmanager/login</p>`
    }
    return mailOptions
}


export function mailService(mailOptions : object) {


    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_EMAIL,
            pass: process.env.NODE_MAILER_CONFIG_PASSWORD // password from gmail
        }
    });
    const promiseObect = new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
                resolve(error)
            } else {
                console.log('Email sent: ' + info.response)
                resolve(info.response)
            }
        })

    })

    return promiseObect

}
