import OpenAIChat from "../mod.ts";

const openAIChat = new OpenAIChat(Deno.env.get("OPENAI_API_KEY")!);

// generate a single answer, wait for the response
try {
  const denoInOneSentence = await openAIChat.complete({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Explain Deno in a single sentence.",
      },
    ],
  });
  console.log(
    "Deno in a single sentence:",
    denoInOneSentence.choices[0].message.content,
  );

  console.log("-----\n");
} catch (e) {
  console.error(e, e.message);
  Deno.exit(1);
}

// generate two answers, wait for the response
const denoCreator = await openAIChat.complete({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "Who created Deno?",
    },
  ],
  n: 2,
});
console.log("Deno was created by:");
denoCreator.choices.forEach((choice, index) => {
  console.log(`Answer ${index + 1}:`, choice.message.content);
});

console.log("-----\n");

// generate two answers, stream the response
const denoLand = await openAIChat.completeAsStream({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "What is Deno Land?",
    },
  ],
  n: 2,
  stream: true,
});

const reader = denoLand.getReader();
const decoder = new TextDecoder();
const denoLandChoices = new Map();

while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }

  const chunk = decoder.decode(value);
  const lines = chunk.trim().split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and lines that contain "[DONE]".
    if (!trimmedLine || trimmedLine.includes("[DONE]")) {
      continue;
    }

    const json = trimmedLine.substring(trimmedLine.indexOf("{"));
    const data = JSON.parse(json);

    for (const choice of data.choices) {
      const { index } = choice;

      // Only create a new response if one does not exist
      if (!denoLandChoices.has(index)) {
        denoLandChoices.set(index, {
          index,
          finish_reason: choice.finish_reason,
          message: {
            role: "assistant",
            content: "",
          },
        });
      }

      const currentChoice = denoLandChoices.get(index);
      if (currentChoice) {
        if (choice?.delta?.hasOwnProperty("role")) {
          currentChoice.message.role = choice.delta.role;
        }
        if (choice?.delta?.hasOwnProperty("content")) {
          currentChoice.message.content += choice.delta.content;
        }
        if (choice.finish_reason !== currentChoice.finish_reason) {
          currentChoice.finish_reason = choice.finish_reason;
        }
      }
    }
  }
}

console.log("Deno Land:");
denoLandChoices.forEach((choice, index) => {
  console.log(`Answer ${index + 1}:`, choice.message.content);
});

console.log("-----\n");

// generate one answer, stream the response, and log as it comes in
const denoName = await openAIChat.completeAsStream({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "Why is Deno called Deno?",
    },
  ],
  stream: true,
});

const nameReader = denoName.getReader();
const nameDecoder = new TextDecoder();
const nameEncoder = new TextEncoder();

console.log("Deno Name:");
while (true) {
  const { done, value } = await nameReader.read();
  if (done) {
    break;
  }

  const chunk = nameDecoder.decode(value);
  const lines = chunk.trim().split("\n");

  for (const line of lines) {
    const trimmedLine = line.trim();
    // Skip empty lines and lines that contain "[DONE]".
    if (!trimmedLine || trimmedLine.includes("[DONE]")) {
      continue;
    }

    const json = trimmedLine.substring(trimmedLine.indexOf("{"));
    const data = JSON.parse(json);

    for (const choice of data.choices) {
      const { role, content } = choice.delta;

      if (role) {
        Deno.stdout.write(nameEncoder.encode(`${role}: `));
      }

      if (content) {
        Deno.stdout.write(nameEncoder.encode(`${content}`));
      }
    }
  }
}

Deno.stdout.write(nameEncoder.encode("\n"));
