import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import mongoDBConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/User.model";
import bcrypt from "bcrypt";
import { signupTypes } from "@/schemas/signUpSchema";
import { NextRequest } from "next/server";

async function GET(req: NextRequest) {
  try {
    const { email, password, username }: signupTypes = await req.json();

    const existedUser = await UserModel.findOne({ email });

    const verifiedCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existedUser?.isVerify == true) {
      return Response.json(
        {
          message: "User already exists with the email",
        },
        {
          status: 401,
        }
      );
    }

    if (existedUser?.isVerify == false) {
      // Here we back
      const hashedPassword = await bcrypt.hash(existedUser.password, 10);
      const newVerifyCodeExpiry = new Date();
      newVerifyCodeExpiry.setHours(newVerifyCodeExpiry.getHours() + 1);

      existedUser.password = hashedPassword;
      existedUser.verifiedCode = verifiedCode;
      existedUser.verifyCodeExpiry = newVerifyCodeExpiry;

      existedUser.save();
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      const expiryDate = new Date();

      expiryDate.setHours(expiryDate.getHours() + 1);

      const user = await UserModel.create({
        username,
        email,
        password: hashedPassword,
        verifiedCode,
        verifyCodeExpiry: expiryDate,
        isVerify: false,
        isAcceptMessage: true,
        message: [],
      });

      await user.save();
    }

    // Send email notification for verification

    const emailResponse = await sendVerificationEmail(
      email,
      verifiedCode,
      username
    );

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    return Response.json(
      {
        success: true,
        message: "User registered successfully. Please verify your account.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(
      {
        success: false,
        message: "Error while register user",
      },
      {
        status: 500,
      }
    );
  }
}
