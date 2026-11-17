
import Contact, { CONTACT_SUBJECTS } from '../models/contactModelSchema.js';

const fail = (res, message, status = 400) => res.status(status).json({ success: false, message });

// =============================================== ADMIN

// get contact list
export const getAllContacts = async (req, res) => {
    try {

    } catch (err) {
        console.log("getAllContacts error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};

// =============================================== PUBLIC

// create contact
export const createContact = async (req, res) => {
    try {
        const { fullName, email, phone, subject, message, privacyAccepted } = req.body || {};

        if (
            typeof fullName !== 'string' || !fullName.trim() || fullName.trim().length > 120 ||
            typeof email !== 'string' || !email.trim() ||
            typeof phone !== 'string' || !phone.trim() || phone.trim().length > 30 ||
            typeof subject !== 'string' || !subject ||
            typeof message !== 'string' || !message.trim()
        ) {
            return fail(res, 'All fields are required');
        }

        if (privacyAccepted !== true) {
            return fail(res, 'Please accept the Privacy Policy', 400);
        }

        const cleanMessage = message.trim();

        if (cleanMessage.length < 10 || cleanMessage.length > 5000) {
            return fail(res, 'Message must be between 10 and 5000 characters');
        }
        if (privacyAccepted !== true) {
            return fail(res, 'Please accept the Privacy Policy');
        }

        const contact = await Contact.create({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            subject,
            message: cleanMessage,
            privacyAccepted: true,
        });

        return res.status(201).json({
            success: true,
            message: 'Your message has been sent successfully',
            contact: {
                contactId: contact.contactId,
                status: contact.status,
                createdAt: contact.createdAt,
            },
        });

    } catch (err) {
        console.log("createContact error :", err);
        return fail(res, 'Server Error Occured', 500);
    }
};