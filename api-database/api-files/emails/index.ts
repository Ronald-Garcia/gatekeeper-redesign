import nodemailer from "nodemailer";

// configure the email transporter using the google account in the .env file
// the EMAIL_PASS is the api password (that must be generated for a particular email account)
export const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

