
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: `"BidDrive Support" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, 
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info.messageId);
        return info;

    } catch (error) {
        console.error("Email send failed:", error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;