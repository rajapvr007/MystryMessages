import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();

  // Get the current session (authenticated user)
  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  // Check if the user is authenticated
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated!",
      },
      { status: 401 }
    );
  }
  try {
    const updateResult = await UserModel.findOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    if (updateResult.modifiedCount == 0) {
      return Response.json(
        {
          success: false,
          message: "Messages are not found or already deleted!",
        },
        { status: 404 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Deleted!",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error is delete message route", error);

    return Response.json(
      {
        success: false,
        message: "Error deleting message!",
      },
      { status: 500 }
    );
  }
}
