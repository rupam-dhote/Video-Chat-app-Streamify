import { transporter } from "./Email.confiq.js";
import {
  Reset_Password_Email_Template,
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./EmailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEamil = async (email, verificationCode) => {
  try {
    const emailMe = process.env.OFFICIAL_EMAIL;
    const response = await transporter.sendMail({
      from: `"Streamify" <${emailMe}>`,

      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email to login", // plain text body
      html: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

export const sendResetPasswordEamil = async (email, verificationCode, name) => {
  try {
    const emailMe = process.env.OFFICIAL_EMAIL;
    const response = await transporter.sendMail({
      from: `"Streamify" <${emailMe}>`,

      to: email, // list of receivers
      subject: "Verify your Email", // Subject line
      text: "Verify your Email to reset password", // plain text body
      html: Reset_Password_Email_Template.replace(
        "{resetCode}",
        verificationCode
      ).replace("{name}", name),
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

export const senWelcomeEmail = async (email, name) => {
  try {
    const emailMe = process.env.OFFICIAL_EMAIL;
    const response = await transporter.sendMail({
      from: `"Streamify" <${emailMe}>`,

      to: email, // list of receivers
      subject: "Welcome Email", // Subject line
      text: "Welcome Email", // plain text body
      html: Welcome_Email_Template.replace("{name}", name),
    });
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
