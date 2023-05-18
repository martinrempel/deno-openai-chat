import { ChatCompletionBody, ChatCompletionResponse } from "./types.ts";
import { createHttpError } from "https://deno.land/std@0.188.0/http/http_errors.ts";

const BASE_URL = "https://api.openai.com/v1/chat/completions";

export default class OpenAIChat {
  #apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API key is required.");
    }

    this.#apiKey = apiKey;
  }

  async #request(body: ChatCompletionBody) {
    const response = await fetch(BASE_URL, {
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.#apiKey}`,
      },
    });

    if (response.status < 200 || response.status >= 300) {
      let message = response.statusText;
      try {
        const { error } = await response.json();

        if (error?.message) {
          message = error.message;
        }
        if (error?.code) {
          message += ` (${error.code})`;
        }
      } catch {
        // ignore
      }
      const error = createHttpError(response.status, message);
      throw error;
    }

    return response;
  }

  async complete(parameters: ChatCompletionBody) {
    if (parameters.stream) {
      throw new Error(
        "This method does not support streaming. Please use completeAsStream() instead.",
      );
    }

    const response = await this.#request(parameters);
    return await response.json() as ChatCompletionResponse;
  }

  async completeAsStream(parameters: ChatCompletionBody) {
    if (!parameters.stream) {
      throw new Error(
        "This method only supports streaming. Please use complete() instead.",
      );
    }

    const response = await this.#request(parameters);
    return response.body as ReadableStream<Uint8Array>;
  }
}

export * from "./types.ts";
