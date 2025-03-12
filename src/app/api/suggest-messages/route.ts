// import OpenAI from "openai";
// // import { OpenAIStream, StreamingTextResponse } from "ai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { NextResponse } from "next/server";
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   try {
//     const { messages } = await req.json();

//     // Ask OpenAi for a streaming chat completion given the prompt

//     const prompt =
//       "Create a list of three open—ended and engaging questions formatted as a single string. Each question should be separated by ' || '. These questions are for an anonymous social messaging platform, like Qooh.me,and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured tike this: 'Whatts a hobby you' e recently started? I Ilf you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming environment.";
//     const response = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo-instruct",
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     // Convert the response into a friendly text—stream
//     const stream = OpenAIStream(response);

//     // Respond with the stream
//     return new StreamingTextResponse(stream);
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       const { name, headers, status, message } = error;
//       return NextResponse.json(
//         { name, headers, status, message },
//         { status: 500 }
//       );
//     } else {
//       console.error("An unexpected error occurred ", error);
//       throw error;
//     }
//   }
// }


import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    return NextResponse.json({ message: "Success", data: body });
  } catch (error) {
    return NextResponse.json({ error :`Something went wrong, ${error}` }, { status: 500 });
  }
}
