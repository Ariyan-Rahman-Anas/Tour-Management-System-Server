import nodemailer from "nodemailer"
import { envVars } from "../config/env"
import path from "path"
import ejs from "ejs"
import AppError from "../errorHelpers/appError"
import httpStatus from "http-status-codes"


const transporter = nodemailer.createTransport({
    host: envVars.EMAIL_SERVICE.SMTP_HOST,
    port: Number(envVars.EMAIL_SERVICE.SMTP_PORT),
    secure: true,
    auth: {
        user: envVars.EMAIL_SERVICE.SMTP_USER,
        pass: envVars.EMAIL_SERVICE.SMTP_PASSWORD
    }
})

interface SendEmailI{
    to:string,
    subject:string,
    templateName:string,
    templateData?:Record<string, string>,
    attachments?:{
        filename:string,
        content:string,
        contentType:string
    }[]
}

export const sendEmail = async({to,subject,templateName,templateData,attachments}:SendEmailI)=>{
   try {
    const templatePath = path.join(__dirname, `templates/${templateName}.ejs`)
    const html = await ejs.renderFile(templatePath, templateData)
 
    const info =await transporter.sendMail({
        from: envVars.EMAIL_SERVICE.SMTP_FROM,
        to,
        subject,
        html,
        attachments: attachments?.map(attachment=>({
            filename:attachment.filename,
            content:attachment.content,
            contentType:attachment.contentType
        }))
    })
    return info
   } catch (error) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to send email!")       
   }
}