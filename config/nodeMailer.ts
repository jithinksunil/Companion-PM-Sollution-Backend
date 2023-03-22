import nodemailer from 'nodemailer'

export function otp(){

    let otpgen= Math.floor(1000 + Math.random() * 9000)
    return otpgen
    
}

export function newConnectionObject(companyName:string){
    let firstFourLetter=companyName.toUpperCase().substring(0,4)
    let connectionSerial= Math.floor(1000 + Math.random() * 9000)
    let logginUserName=firstFourLetter+connectionSerial+'CMPN'
    let password=Math.floor(1000 + Math.random() * 9000)
    return {logginUserName,password}

}
 
export function OtpMailObject(email:string,otpgen:number){

    let mailOptions = {
        from: 'jithinksunil96@gmail.com',
        to: email,
        subject: 'YOUR OTP',
        html: `<p>${otpgen}</p>`
    }
    return mailOptions
}
type connectionType={
    logginUserName:string,
    password:number
}

export function newConnectionMailObject(email:string,data:connectionType){

    let mailOptions = {
        from: 'jithinksunil96@gmail.com',
        to: email,
        subject: 'Your Login Credentials',
        html: `<p>
        Your loggin user name:${data.logginUserName}<br>
        Your Password:${data.password}<br>
        Use the following link to loggin:<br>
        http://localhost:3000/projectmanager/login</p>`
    }
    return mailOptions
}


export function mailService(mailOptions:object){


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'jithinksunil96@gmail.com',
            pass: 'nskzhacimzlqfors'  // password from gmail
        }
    });
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    })
}

