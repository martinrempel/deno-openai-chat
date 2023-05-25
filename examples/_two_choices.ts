import OpenAIChat from "../mod.ts";

const API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!API_KEY) {
  throw new Error("OPENAI_API_KEY is required.");
}

console.log(`Prompt: "Explain Deno in a single sentence."\n`);

const completion = await new OpenAIChat(API_KEY).complete({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "user",
      content: "Explain Deno in a single sentence.",
    },
  ],
  n: 2,
  // be warned: maximum temperature can lead to gibberish
  temperature: 2,
});

completion.choices.forEach((choice, index) => {
  console.log(`Answer ${index + 1}: ${choice.message.content}\n`);
});
