import brevo from "@getbrevo/brevo";
import dotenv from "dotenv";
dotenv.config();

const BREVO_KEY = process.env.APP_BREVO_KEY;
const emailInstance = new brevo.TransactionalEmailsApi();

// ⭐ This is the ONLY correct way in Brevo v3
emailInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

export default emailInstance;

// for smtp service
// export const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // true for port 465, false for other ports
//   auth: {
//     user: email,
//     pass: pass,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });
