import request, { type DataRequestClient, type RequestConfig } from "../../../utils/request";
import type { Id, PageData } from "../../shared/types";
import type {
  TextImageVideoCreateRequest,
  TextImageVideoTask,
  TextImageVideoTaskPageResponse,
  TextImageVideoTaskQuery,
} from "./types";

// ... existing code ...

/**
 * 分页查询图文视频任务列表
 * 
 * @param params - 查询参数，包含分页信息和状态筛选条件
 * @returns {Promise<PageData<TextImageVideoTask>>} 返回分页数据，包含任务列表和分页信息
 */
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

/**
 * 创建图文视频生成任务
 * 
 * @param data - 任务创建请求数据，包含图片URL数组、提示词和可选的模型参数
 * @returns {Promise<TextImageVideoTask>} 返回创建的任务详情
 */
export function createTextImageVideoTask(
  data: TextImageVideoCreateRequest,
  client: DataRequestClient = request,
) {
  return client.post<TextImageVideoTask>("/user-api/customer/text-image-video/tasks", data);
}

/**
 * 获取图文视频任务详情
 * 
 * @param id - 任务ID
 * @returns {Promise<TextImageVideoTask>} 返回任务详细信息，包括状态、进度、生成的视频URL等
 */
export function getTextImageVideoTaskDetail(
  id: Id,
  configOrClient?: RequestConfig | DataRequestClient,
  clientArg?: DataRequestClient,
) {
  const { client, config } = resolveRequestArgs(configOrClient, clientArg);
  return client.get<TextImageVideoTask>(`/user-api/customer/text-image-video/tasks/${id}`, config);
}

/**
 * 删除图文视频任务
 * 
 * @param id - 要删除的任务ID
 * @returns {Promise<void>} 删除操作完成，无返回值
 */
export function deleteTextImageVideoTask(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`/user-api/customer/text-image-video/tasks/${id}`);
}
