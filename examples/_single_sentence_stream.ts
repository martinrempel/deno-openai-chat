import OpenAIChat from "../mod.ts";

const API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!API_KEY) {
  throw new Error("OPENAI_API_KEY is required.");
}

console.log(`Prompt: "Explain Deno in a single sentence."\n`);

const completionStream = await new OpenAIChat(API_KEY).completeAsStream({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "Explain Deno in a single sentence.",
    },
  ],
  temperature: 0.1,
  stream: true,
});

const reader = completionStream.getReader();
const decoder = new TextDecoder();
const encoder = new TextEncoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) {
    break;
  }

  const chunk = decoder.decode(value);
  const lines = chunk.trim().split("\n");

  for (const line of lines) {
    const trimmed = line.trim();

    // streams are terminated by a "data: [DONE]" message, which we don't want to print
    if (!trimmed || trimmed.includes("data: [DONE]")) {
      continue;
    }

    const json = trimmed.substring(trimmed.indexOf("{"));
    const completion = JSON.parse(json);

    for (const choice of completion.choices) {
      const { role, content } = choice.delta;

      if (role) {
        await Deno.stdout.write(encoder.encode(`${role}: `));
      }

      if (content) {
        await Deno.stdout.write(encoder.encode(`${content}`));
      }
    }
  }
}

Deno.stdout.write(encoder.encode("\n"));
