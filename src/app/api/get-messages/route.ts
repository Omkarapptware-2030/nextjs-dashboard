import { getServerSession } from "next-auth";
import { AuthOptions } from "../Auth/[...nextauth]/options";
import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { Session } from "inspector/promises";
import mongoose from "mongoose";

export async function GET(request: Request) {
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

  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$message" },
      { $sort: { "message.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          message: { $push: "$message" },
        },
      },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        { success: false, message: "User not Found" },
        { status: 404 }
      );
    }
    return Response.json(
      { success: true, messages: user[0].messages },
      { status: 200 }
    );
  } catch (err) {
    console.log("unexpected error occured:", err);

    return Response.json(
      {
        success: false,
        message: "unexpected error occurred: ",
        err,
      },
      { status: 500 }
    );
  }
}
