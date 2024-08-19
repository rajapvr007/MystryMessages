import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import mongoose from "mongoose";

// ! This code updates the authenticated user's message acceptance status in the database and returns a JSON response indicating success or failure.
export async function POST(request: Request) {
  // Connect to the database
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

  const userId = new mongoose.Types.ObjectId(user._id); // Get the user's ID from the session

  //todo Log user ID (should be removed in production)
  console.log("This error from accept-message route", userId);

  // Extract the acceptMessages field from the request body
  const { acceptMessages } = await request.json();

  try {
    // Find the user by ID and update their isAcceptingMessages status
    const updateUser = await UserModel.findOneAndUpdate(
      userId,
      {
        isAccptingMessages: acceptMessages,
      },
      { new: true } // Return the updated document
    );

    // If no user was found and updated
    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages",
        },
        { status: 401 }
      );
    }

    // Return success response with the updated user data
    return Response.json(
      {
        success: true,
        message: "Message acceptance status updated successfully.",
        updateUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error and return a failure response
    console.log("Failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

// ! This code retrieves the authenticated user's message acceptance status from the database and returns a JSON response indicating success or failure
export async function GET(request: Request) {
  // Connect to the database
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

  const userId = user._id; // Get the user's ID from the session

  try {
    // Find the user by ID
    const foundUser = await UserModel.findById(userId);

    // If the user is not found
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found!",
        },
        { status: 404 }
      );
    }

    // Return success response with the user's isAcceptingMessages status
    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
        message: "User found!",
        foundUser,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log error and return a failure response
    console.log("Error in getting message acceptance status.");
    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status.",
      },
      { status: 500 }
    );
  }
}
// export async function GET(request: Request) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   const user: User = session?.user;
//   if (!session || !session.user) {
//     return Response.json(
//       {
//         success: false,
//         message: "Not Authenticated!",
//       },
//       { status: 401 }
//     );
//   }
//   const userId = user._id;
//   try {
//     const foundUser = await UserModel.findById(userId);
//     if (!foundUser) {
//       return Response.json(
//         {
//           success: false,
//           message: "User not found!",
//         },
//         { status: 404 }
//       );
//     }
//     return Response.json(
//       {
//         success: true,
//         isAcceptingMessages: foundUser.isAcceptingMessage,
//         message: "User  found!",
//         foundUser,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.log("Error in getting message acceptance status.");
//     return Response.json(
//       {
//         success: false,
//         message: "Error in getting message acceptance status.",
//       },
//       { status: 500 }
//     );
//   }
// }
