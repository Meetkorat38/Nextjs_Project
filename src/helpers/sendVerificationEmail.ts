import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verifiactionEmail";
import { Apiresponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  verificationCode: string,
  username: string
): Promise<Apiresponse> {
  try {
    await resend.emails.send({
      from: "<onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Annonymous | verifiaction code",
      react: VerificationEmail({ otp: verificationCode, username }),
    });

    return {
      success: true,
      message: "Verification code successfully sent",
    };
  } catch (error) {
    console.error("Verification code error", error);
    return {
      success: false,
      message: "email Verification code failed",
    };
  }
}
