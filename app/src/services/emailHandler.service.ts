import { createTransport } from "nodemailer";
import { get } from "../../config/config";

const config = get(process.env.NODE_ENV);

const sendMail = async (
    toEmail: string,
    subject: string,
    bodyData: any
) => {
    try {
        const transporter = createTransport({
            host: config.EMAIL.HOST,
            port: config.EMAIL.SMTP_PORT,
            service: config.EMAIL.SERVICE || "gmail",
            auth: {
                user: config.EMAIL.EMAIL_USERNAME,
                pass: config.EMAIL.EMAIL_PASSWORD,
            },
        });
        const mailOptions = {
            from: config.EMAIL.EMAIL_USERNAME,
            to: toEmail,
            subject: subject,
            html: bodyData,
        };

        await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log("Error(sendResponse): ", err);
        throw err;
    }
};

export const emailHandler = {
    sendMail,
}