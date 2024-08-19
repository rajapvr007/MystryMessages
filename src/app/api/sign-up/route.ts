import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserVerfiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerfiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 400,
        }
      );
    }

    const verifyCode = Math.floor(10000 + Math.random() * 900000).toString();
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: true,
            message: "User already exist with this Email!",
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        (existingUserByEmail.password = hashedPassword),
          (existingUserByEmail.verifyCode = verifyCode),
          (existingUserByEmail.verifyCodeExpiry = new Date(
            Date.now() + 3600000
          ));
        await existingUserByEmail.save();
      }
    } else {
      //creating new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      await newUser.save();
    }

    //send verifcation mail
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }
    return Response.json(
      {
        success: true,
        message: "User registered successfully and please verify the email!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in registering the User");
    return Response.json(
      {
        success: true,
        message: "Error in registering the User",
      },
      {
        status: 500,
      }
    );
  }
}
