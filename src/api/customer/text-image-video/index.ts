import request, { type DataRequestClient, type RequestConfig } from "../../../utils/request";
import type { Id } from "../../shared/types";
import type {
  TextImageVideoCreateRequest,
  TextImageVideoPromptGenerateRequest,
  TextImageVideoPromptGenerateResponse,
  TextImageVideoTask,
  TextImageVideoTaskPageResponse,
  TextImageVideoTaskQuery,
} from "./types";

function isRequestClient(value: unknown): value is DataRequestClient {
  return (typeof value === "object" || typeof value === "function") && value !== null && "get" in value;
}

function resolveRequestArgs(
  arg1?: RequestConfig | DataRequestClient,
  arg2?: DataRequestClient,
) {
  if (isRequestClient(arg1)) {
    return {
      client: arg1,
      config: undefined,
    };
  }

  return {
    client: arg2 ?? request,
    config: arg1,
  };
}

function createLocalPromptFallback(data: TextImageVideoPromptGenerateRequest) {
  const cleanTopic = data.topic.trim();
  const imageHint =
    data.inputMode === "text"
      ? "围绕主题直接展开内容"
      : `结合已上传的 ${data.imageUrls.length} 张参考图组织镜头与画面描述`;

  return [
    `请围绕“${cleanTopic}”生成一条适合短视频成片的中文文案。`,
    `整体风格要求自然、口语化、适合社交平台传播，${imageHint}。`,
    "文案请包含开场吸引点、核心卖点、使用场景和结尾行动引导。",
    "画面节奏控制在 15 到 30 秒，字幕表达简洁，适合配音和自动字幕生成。",
  ].join("");
}

export function getTextImageVideoTaskPage(
  params?: TextImageVideoTaskQuery,
  configOrClient?: RequestConfig | DataRequestClient,
  clientArg?: DataRequestClient,
) {
  const { client, config } = resolveRequestArgs(configOrClient, clientArg);
  return client.get<TextImageVideoTaskPageResponse>("/user-api/customer/text-image-video/tasks", {
    params,
    ...config,
  });
}

export function createTextImageVideoTask(
  data: TextImageVideoCreateRequest,
  client: DataRequestClient = request,
) {
  return client.post<TextImageVideoTask>("/user-api/customer/text-image-video/tasks", data);
}

export function generateTextImageVideoPrompt(
  data: TextImageVideoPromptGenerateRequest,
  _client: DataRequestClient = request,
): Promise<TextImageVideoPromptGenerateResponse> {
  // 当前产品文档尚未公开文图生视频专属生成文案接口，这里先提供前端可替换的预生成边界。
  return Promise.resolve({
    prompt: createLocalPromptFallback(data),
  });
}

export function getTextImageVideoTaskDetail(
  id: Id,
  configOrClient?: RequestConfig | DataRequestClient,
  clientArg?: DataRequestClient,
) {
  const { client, config } = resolveRequestArgs(configOrClient, clientArg);
  return client.get<TextImageVideoTask>(`/user-api/customer/text-image-video/tasks/${id}`, config);
}

export function deleteTextImageVideoTask(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`/user-api/customer/text-image-video/tasks/${id}`);
}
