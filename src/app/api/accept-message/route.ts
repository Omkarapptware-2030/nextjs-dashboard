import { getServerSession } from "next-auth";
import { AuthOptions } from "../Auth/[...nextauth]/options";
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated ",
      },
      { status: 401 }
    );
  }
  const userId = user._id;
  const { acceptMessage } = await request.json();
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessage },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        { status: 500 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Message Acceptance Updated Successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (err) {
    console.log("failed to update user status to accept messages", err);

    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      { status: 500 }
    );
  }
}

export async function GET(/*request: Request*/) {
  await dbConnect();
  const session = await getServerSession(AuthOptions);
  const user: User = session?.user;
  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated ",
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const foundUser = await UserModel.findById(userId);
  try {
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Error in getting message acceptance status", error);

    return Response.json(
      {
        success: false,
        message: "Error in getting message acceptance status",
      },
      { status: 500 }
    );
  }
}
