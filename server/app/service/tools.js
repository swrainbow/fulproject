const {Service} = require('egg')
const nodemailer = require('nodemailer')

const userEmail = '15957178344@163.com'
const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    secure: true,
    auth:{
        user:userEmail,
        pass:'001024'
    }
})

class ToolService extends Service {
    async sendMail(email,subject,text,html){
        const mailOptions = {
            from: userEmail,
            to: email,
            cc: userEmail,
            subject,
            text,
            html
        }
        console.log('=======start send email')
        try {
            await transporter.sendMail(mailOptions)
            return true
        } catch (error) {
            console.log('email error',err)
            return false
        }
    }
}

module.exports = ToolService