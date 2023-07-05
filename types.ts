/** See https://platform.openai.com/docs/models/model-endpoint-compatibility */
export type Model =
  | "gpt-4"
  | "gpt-4-0613"
  | "gpt-4-32k"
  | "gpt-4-32k-0613"
  | "gpt-3.5-turbo"
  | "gpt-3.5-turbo-0613"
  | "gpt-3.5-turbo-16k"
  | "gpt-3.5-turbo-16k-0613";

export type Role = "user" | "assistant" | "system";
export type Message = {
  role: Role;
  content: string;
  name?: string;
};

/** See https://platform.openai.com/docs/api-reference/chat/create */
export interface ChatCompletionBody {
  model: Model;
  messages: Message[];
  temperature?: number;
  top_p?: number;
  n?: number;
  stream?: boolean;
  stop?: string[];
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
  logit_bias?: Record<string, number>;
  user?: string;
}

/** See https://platform.openai.com/docs/guides/chat/response-format */
export type FinishReason = "stop" | "length" | "content_filter" | "null";

export interface Choice {
  index: number;
  finish_reason: FinishReason;
  message: {
    role: "assistant";
    content: string;
  };
}

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

export interface ChatCompletionResponse {
  id: string;
  object: "chat.completion";
  created: number;
  choices: Choice[];
  usage: Usage;
}
