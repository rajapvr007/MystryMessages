import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();
    // console.log("Messages received:", messages); // Log messages

    // const coreMessages = convertToCoreMessages(messages);
    // console.log("Core messages:", coreMessages); // Log core messages

    // const result = await streamText({
    //   model: openai("gpt-4-turbo"),
    //   messages: coreMessages,
    // });
    // console.log("Result object:", result); // Log result object

    // const dataStreamResponse = result.toDataStreamResponse();
    // console.log("Data stream response:", dataStreamResponse); // Log data stream response

    // return dataStreamResponse;

    const { messages } = await req.json();

    const result = await streamText({
      model: openai("gpt-4-turbo"),
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error occurred:", error);

    // Generic error handling
    return new Response(
      JSON.stringify({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
      }),
      { status: 500 }
    );
  }
}

// import OpenAI from "openai";
// import { OpenAIStream, StreamingTextResponse } from "ai";
// import { NextResponse } from "next/server";

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const runtime = "edge";

// export async function POST(req: Request) {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await openai.completions.create({
//       model: "gpt-3.5-turbo-instruct",
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     const stream = OpenAIStream(response);

//     return new StreamingTextResponse(stream);
//   } catch (error) {

//     if (error instanceof OpenAI.APIError) {
//       // OpenAI API error handling
//       const { name, status, headers, message } = error;
//       return NextResponse.json({ name, status, headers, message }, { status });
//     } else {
//       // General error handling
//       console.error("An unexpected error occurred:", error);
//       throw error;
//     }
//   }
// }
