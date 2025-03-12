import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await request.json();
    //existing username check
    const existingUserVerifiedbyUsername = await UserModel.findOne({
      username,
      isverified: true,
    });

    if (existingUserVerifiedbyUsername) {
      return Response.json(
        { success: false, message: "Username is already taken " },
        { status: 400 }
      );
    }

    //existing  user by email
    const existingUserbyemail = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    if (existingUserbyemail) {
      if (existingUserbyemail.isverified) {
        return Response.json(
          { success: false, message: "user already exist with this email" },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserbyemail.password = hashedPassword;
        existingUserbyemail.verifyCode = verifyCode;
        existingUserbyemail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserbyemail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isverified: false,
        isAcceptingMessage: true,
        message: [],
      });
      await newUser.save();
    }
    //send verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return Response.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully and please verify email",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error registering user",
      },
      {
        status: 500,
      }
    );
  }
}

//Summary
// Connects to the database.
// Extracts user input (username, email, password).
// Checks if the username is already taken.
// Checks if the email is already registered:
// If the email is verified → Rejects registration.
// If the email is unverified → Updates password & verification code.
// If the email doesn't exist → Creates a new user.
// Sends a verification email.
// Returns a success or failure response.
