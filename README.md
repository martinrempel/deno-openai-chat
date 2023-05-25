# deno-openai-chat

Very simple convenience wrapper for OpenAI's
[chat completion API](https://platform.openai.com/docs/api-reference/chat/create),
to be used with [Deno](https://deno.land).

## Usage

A basic completion, making use of system messages, looks like this:

```js
import OpenAIChat, { Model, Message } from "deno-openai-chat/mod.ts";

const chat = new OpenAIChat(YOUR_OPENAI_API_KEY);

// note: gpt-4 API access required!
const model: Model = "gpt-4";
const messages: Message[] = [
  {
    role: "system",
    content: 'End all your answears with the word "great".',
  },
  {
    role: "user",
    content: "Explain Deno in a single sentence.",
  },
];

const completion = await new chat.complete({
  model,
  messages,
});

// prints the complete answer returned by OpenAI
console.log(completion);

// print the models response as well as the number of tokens used *only* for the response
console.log(`Answer: "${completion.choices[0].message.content}" (${completion.usage.completion_tokens} tokens)`);
```

# License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.
