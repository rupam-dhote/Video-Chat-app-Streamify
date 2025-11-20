import emailInstance from "./Email.confiq.js";
import {
  Reset_Password_Email_Template,
  Verification_Email_Template,
  Welcome_Email_Template,
} from "./EmailTemplate.js";
import dotenv from "dotenv";
dotenv.config();

const OFFICIAL_EMAIL = process.env.OFFICIAL_EMAIL;

export const sendVerificationEamil = async (email, verificationCode) => {
  try {
    const sendSMTPEmail = {
      sender: { name: "Streamify", email: OFFICIAL_EMAIL }, // YES Gmail works
      replyTo: { email: OFFICIAL_EMAIL, name: "Streamify Support" },
      to: [{ email }],
      subject: "Verify your Email",
      htmlContent: Verification_Email_Template.replace(
        "{verificationCode}",
        verificationCode
      ),
    };
    const response = await emailInstance.sendTransacEmail(sendSMTPEmail);
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

export const sendResetPasswordEamil = async (email, verificationCode, name) => {
  try {
    const sendSMTPEmail = {
      sender: { name: "Streamify", email: OFFICIAL_EMAIL }, // YES Gmail works
      replyTo: { email: OFFICIAL_EMAIL, name: "Streamify Support" },
      to: [{ email }],
      subject: "Verify your Email to reset password",
      htmlContent: Reset_Password_Email_Template.replace(
        "{resetCode}",
        verificationCode
      ).replace("{name}", name),
    };
    const response = await emailInstance.sendTransacEmail(sendSMTPEmail);
    console.log("Email send Successfully :", response);
  } catch (error) {
    console.log("Email error", error);
  }
};

export const senWelcomeEmail = async (email, name) => {
  try {
    const sendSMTPEmail = {
      sender: { name: "Streamify", email: OFFICIAL_EMAIL }, // YES Gmail works
      replyTo: { email: OFFICIAL_EMAIL, name: "Streamify Support" },
      to: [{ email }],
      subject: "Verify your Email to reset password",
      htmlContent: Welcome_Email_Template.replace("{name}", name),
    };
    const response = await emailInstance.sendTransacEmail(sendSMTPEmail);
    console.log("Email send Successfully", response);
  } catch (error) {
    console.log("Email error", error);
  }
};
