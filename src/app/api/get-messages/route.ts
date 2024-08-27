import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();
  console.log("get messages route mein huin");
  // Get the current session (authenticated user)
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  console.log("inside get message route user:", user);
  console.log("session from the get messages api", session);
  //todo: remove in production
  console.log("user from the get-messages api", user);
  // Check if the user is authenticated
  if (!session || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated!",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user._id);
  const email = user?.email;
  //todo remove
  console.log("UserId from the get messages route", userId, email);
  try {
    console.log("userId", userId);
    // const user = await UserModel.aggregate([
    //   { $match: { email: email } },
    //   { $unwind: "$messages" },
    //   { $sort: { "messages.createdAt": -1 } },
    //   { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    // ]).exec();
    const user = await UserModel.aggregate([
      { $match: { email: email } }, // Match user by email
      {
        $project: {
          messages: { $reverseArray: { $sortArray: { input: "$messages", sortBy: { createdAt: -1 } } } },
        },
      },
    ]).exec();
    

    console.log("User from the get message try catch block", user);
    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found!@!",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        messages: user[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving messages:", error);
    return Response.json(
      { success: false, message: "Error retrieving messages" },
      { status: 500 }
    );
  }
}
