import {
  sendResetPasswordEamil,
  sendVerificationEamil,
  senWelcomeEmail,
} from "../middleware/Email.js";
import User from "../Models/User.js";
import { upsertStreamUser } from "../lib/stream.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
// singup logic
export const singup = async (req, res) => {
  try {
    const { email, fullName, password } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "Email already exists " });
    }

    const index = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `/avatars/AV${index}.png`;
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const newUser = await User.create({
      email,
      password,
      fullName,
      profilePic: randomAvatar,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 5 * 60 * 1000,
      //for 5 mints
    });

    await sendVerificationEamil(newUser.email, newUser.verificationToken);
    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in Signup:", error);
  }
};

// Login logic
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isConnected = mongoose.connection;

    if (isConnected.readyState !== 1) {
      return res
        .status(400)
        .json({ message: "Network issue Server not respond" });
    }

    // both field check
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }
    // password check
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    // email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isCorrectPass = await user.matchPassword(password);
    if (!isCorrectPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2d",
    });

    // if email not verified
    if (!user.isVerified) {
      if (user.verificationTokenExpiresAt > Date.now()) {
        return res
          .status(404)
          .json({ message: "Previous OTP not expired yet!" });
      }
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      user.verificationToken = verificationToken;
      user.verificationTokenExpiresAt = Date.now() + 5 * 60 * 1000;
      await user.save();
      await sendVerificationEamil(user.email, user.verificationToken);
      return res.status(201).json({
        success: true,
        message: "Email Verification code sent, Please verify your email",
        user,
      });
    }

    res.cookie("jwt", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ success: true, message: "Login successfull", user });
  } catch (err) {
    console.log("Login Error : ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// logout login
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logout successfully" });
};

// onboarding function
export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All Fields Are Required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    //  stream user update
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(
        `Stream User Updated after onBoarding : ${updatedUser.fullName}`
      );
    } catch (err) {
      console.error("Error while updating the Stream user : ", err);
    }
    res.status(200).json({ success: true, user: updatedUser });
  } catch (err) {
    console.log("onBoarding Error : ", err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

//for verify otp
export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const newUser = await User.findOne({
      email,
      verificationToken: { $exists: true, $ne: "" },
    });

    if (!newUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found" });
    }

    if (newUser.verificationToken !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (newUser.verificationTokenExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired, please resend OTP",
      });
    }

    newUser.isVerified = true;
    newUser.verificationToken = undefined;
    newUser.verificationTokenExpiresAt = undefined;
    await newUser.save();

    if (newUser.isVerified !== true) {
      return res.status(401).json({
        success: false,
        message: "Email not verified Please try again later",
      });
    }

    // connecting to the stream use
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream User Created : ${newUser.fullName}`);
    } catch (err) {
      console.error("Error while conecting to Stream: ", err);
    }

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "2d" }
    );

    res.cookie("jwt", token, {
      maxAge: 2 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    await senWelcomeEmail(newUser.email, newUser.fullName);
    return res
      .status(200)
      .json({ success: true, message: "Email Verifed Successfully" });
  } catch (err) {
    console.log("Email Verification Error: ", err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

//forgot password controllers

// for resend otp in foggot password
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Please Enter the Email" });
    }

    // email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // find user in database
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found, Please enter valid email" });
    }

    if (user.resetPasswordExpiresAt > Date.now()) {
      return res.status(404).json({ message: "OTP not expired yet" });
    }
    const resetPasswordToken = Math.floor(
      1000 + Math.random() * 9000
    ).toString();

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpiresAt = Date.now() + 60 * 1000;
    await user.save();

    await sendResetPasswordEamil(
      user.email,
      user.resetPasswordToken,
      user.fullName
    );
    res.status(201).json({ success: true, message: "OTP send successfully" });
  } catch (err) {
    console.log("Error In Resend OTP: ", err);
    res
      .status(500)
      .json({ message: "Internal server error while sending OTP" });
  }
};

// for verify forgot email account
export const verifyForgotEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const newUser = await User.findOne({
      email,
      resetPasswordToken: { $exists: true, $ne: "" },
    });

    if (!newUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found" });
    }

    if (newUser.resetPasswordToken !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (newUser.resetPasswordExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired, please resend OTP",
      });
    }

    newUser.resetPasswordToken = "";
    newUser.resetPasswordExpiresAt = undefined;
    await newUser.save();
    return res
      .status(200)
      .json({ success: true, message: "Email Verifed Successfully" });
  } catch (err) {
    console.log("Email Verification Error: ", err);
    res.status(500).json({ message: "Internal server Error" });
  }
};

// for change password route
export const changePassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required!" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const existUser = await User.findOne({ email });

    if (!existUser) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found" });
    }

    if (await existUser.matchPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password.",
      });
    }

    existUser.password = newPassword;
    existUser.save();

    res
      .status(200)
      .json({ success: true, message: "Password Reset successfully" });
  } catch (err) {
    console.log("Error While Changing Pasword: ", err);
    res.status(500).json({ message: "Internal server Error" });
  }
};
