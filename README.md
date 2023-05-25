# deno-openai-chat

Very simple convenience wrapper for OpenAI's
[chat completion API](https://platform.openai.com/docs/api-reference/chat/create),
to be used with [Deno](https://deno.land).

## Usage

### Basic

A basic completion, making use of system messages, looks like this:

```ts
import OpenAIChat, { Message, Model } from "deno-openai-chat/mod.ts";

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
console.log(
  `Answer: "${
    completion.choices[0].message.content
  }" (${completion.usage.completion_tokens} tokens)`,
);
```

### Streamed Response

Streamed responses are supported. This can be useful to print the answer to the
console, as soon as new tokens are available.

```ts
import OpenAIChat, { Message, Model } from "deno-openai-chat/mod.ts";

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

const completionStream = await new chat.completeAsStream({
  model,
  messages,
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
    // Skip empty lines and lines that contain "[DONE]".
    if (!trimmed || trimmed.includes("[DONE]")) {
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
```

# License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE)
file for details.
