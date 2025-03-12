import dbConnect from "@/lib/bdConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();
  const { username, content } = await request.json();

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 500 }
      );
    }
    if (username.isAcceptingMessage) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        { status: 403 }
      );
    }
    const newMessage = { content, createAt: new Date() };
    user.message.push(newMessage as Message);
    await user.save();
    return Response.json(
      {
        success: true,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("Internal server error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error: ",
        error,
      },
      { status: 500 }
    );
  }
}
