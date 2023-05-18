import {
  assertRejects,
  assertThrows,
} from "https://deno.land/std@0.188.0/testing/asserts.ts";
import OpenAIChat from "./mod.ts";

Deno.test({
  name: "throws if no API key is provided",
  fn() {
    assertThrows(
      () => new OpenAIChat(""),
      Error,
      "API key is required.",
    );
  },
});

Deno.test({
  name: "throws if complete() is called with stream: true",
  async fn() {
    const openAIChat = new OpenAIChat("test");
    await assertRejects(
      async () =>
        await openAIChat.complete({
          model: "gpt-4",
          messages: [],
          stream: true,
        }),
      Error,
      "This method does not support streaming. Please use completeAsStream() instead.",
    );
  },
});

Deno.test({
  name: "throws if completeAsStream() is called with stream: false",
  async fn() {
    const openAIChat = new OpenAIChat("test");
    await assertRejects(
      async () =>
        await openAIChat.completeAsStream({
          model: "gpt-4",
          messages: [],
          stream: false,
        }),
      Error,
      "This method only supports streaming. Please use complete() instead.",
    );
  },
});
