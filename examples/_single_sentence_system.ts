import OpenAIChat from "../mod.ts";

const API_KEY = Deno.env.get("OPENAI_API_KEY");
if (!API_KEY) {
  throw new Error("OPENAI_API_KEY is required.");
}

console.log(
  `Prompt: "Explain Deno in a single sentence."\nThe system will respond with "great" at the end of each answer, hopefully.\n`,
);

const completion = await new OpenAIChat(API_KEY).complete({
  model: "gpt-3.5-turbo",
  messages: [
    {
      role: "system",
      content: 'End all your answears with the word "great".',
    },
    {
      role: "user",
      content: "Explain Deno in a single sentence.",
    },
  ],
});

console.log(completion.choices[0].message.content);
