import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
// import { z } from "zod";
// import { usernameValidation } from "@/schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isverified = true;
      await user.save();
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            "Verification Code Expired , Please Signup again to get a new code",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Incorrect Verification code",
        },
        { status: 400 }
      );
    }
    return Response.json(
      { success: true, message: "Account Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifing user", error);
    return Response.json(
      { success: false, message: "Error verifing user" },
      { status: 500 }
    );
  }
}
