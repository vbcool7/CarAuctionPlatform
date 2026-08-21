
import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        const { data, error } = await resend.emails.send({
            from: `BidDrive Support <${process.env.EMAIL_USER}>`,
            to: [process.env.EMAIL_USER],
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend email failed:", error);
            throw new Error(error.message);
        }

        console.log("Email sent successfully:", data.id);
        return data;

    } catch (error) {
        console.error("Email send failed:", error.message);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail;