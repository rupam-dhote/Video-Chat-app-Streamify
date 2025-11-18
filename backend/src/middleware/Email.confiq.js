import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const email = process.env.OFFICIAL_EMAIL;
const pass = process.env.APP_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: email,
    pass: pass,
  },
});
