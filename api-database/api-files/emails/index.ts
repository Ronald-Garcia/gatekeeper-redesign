import Bree from "bree";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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


export const bree = new Bree({
    root: join(__dirname, "../emails/jobs")
});