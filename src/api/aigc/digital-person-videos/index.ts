import request, { type DataRequestClient } from "../../../utils/request";
import type { Id } from "../../shared/types";
import type {
  DigitalPersonVideo,
  DigitalPersonVideoBackendPageResponse,
  DigitalPersonVideoCreateRequest,
  DigitalPersonVideoPageData,
  DigitalPersonVideoQuery,
} from "./types";

const DIGITAL_PERSON_VIDEOS_BASE_URL = "/user-api/aigc/digital-person-videos";

function toPageData(data: DigitalPersonVideoBackendPageResponse): DigitalPersonVideoPageData {
  return {
    list: Array.isArray(data.records) ? data.records : [],
    total: typeof data.total === "number" ? data.total : 0,
    pageNum: data.current,
    pageSize: data.size,
    pages: data.pages,
  };
}

export async function getDigitalPersonVideoPage(
  params?: DigitalPersonVideoQuery,
  client: DataRequestClient = request,
) {
  const data = await client.get<DigitalPersonVideoBackendPageResponse>(DIGITAL_PERSON_VIDEOS_BASE_URL, {
    params,
  });
  return toPageData(data);
}

export function createDigitalPersonVideo(
  data: DigitalPersonVideoCreateRequest,
  client: DataRequestClient = request,
) {
  return client.post<DigitalPersonVideo>(DIGITAL_PERSON_VIDEOS_BASE_URL, data);
}

export function getDigitalPersonVideoDetail(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPersonVideo>(`${DIGITAL_PERSON_VIDEOS_BASE_URL}/${id}`);
}

export function deleteDigitalPersonVideo(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`${DIGITAL_PERSON_VIDEOS_BASE_URL}/${id}`);
}

export function refreshDigitalPersonVideo(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPersonVideo>(`${DIGITAL_PERSON_VIDEOS_BASE_URL}/${id}/refresh`);
}
