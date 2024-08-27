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


