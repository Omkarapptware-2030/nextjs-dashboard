import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/emailVerification";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystry Message | verification Code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: "verification email sent successfully",
      messages: [],
    };
  } catch (emailError) {
    console.log("email sending verification error", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
      messages: [],
    };
  }
}
