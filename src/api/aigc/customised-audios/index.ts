import request, { type DataRequestClient } from "../../../utils/request";
import type { Id } from "../../shared/types";
import type {
  CustomisedAudio,
  CustomisedAudioBackendPageResponse,
  CustomisedAudioCreateRequest,
  CustomisedAudioPageData,
  CustomisedAudioQuery,
} from "./types";

const CUSTOMISED_AUDIOS_BASE_URL = "/user-api/aigc/customised-audios";

function toPageData(data: CustomisedAudioBackendPageResponse): CustomisedAudioPageData {
  return {
    list: Array.isArray(data.records) ? data.records : [],
    total: typeof data.total === "number" ? data.total : 0,
    pageNum: data.current,
    pageSize: data.size,
    pages: data.pages,
  };
}

export async function getCustomisedAudioPage(
  params?: CustomisedAudioQuery,
  client: DataRequestClient = request,
) {
  const data = await client.get<CustomisedAudioBackendPageResponse>(CUSTOMISED_AUDIOS_BASE_URL, {
    params,
  });
  return toPageData(data);
}

export function createCustomisedAudio(
  data: CustomisedAudioCreateRequest,
  client: DataRequestClient = request,
) {
  return client.post<CustomisedAudio>(CUSTOMISED_AUDIOS_BASE_URL, data);
}

export function getCustomisedAudioDetail(id: Id, client: DataRequestClient = request) {
  return client.get<CustomisedAudio>(`${CUSTOMISED_AUDIOS_BASE_URL}/${id}`);
}

export function deleteCustomisedAudio(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`${CUSTOMISED_AUDIOS_BASE_URL}/${id}`);
}

export function refreshCustomisedAudio(id: Id, client: DataRequestClient = request) {
  return client.get<CustomisedAudio>(`${CUSTOMISED_AUDIOS_BASE_URL}/${id}/refresh`);
}
