import request, { type DataRequestClient } from "../../../utils/request";
import type { Id } from "../../shared/types";
import { uploadConfig } from "../../shared/utils";
import type {
  DigitalPerson,
  DigitalPersonBackendPageResponse,
  DigitalPersonCreateRequest,
  DigitalPersonPageResponse,
  DigitalPersonQuery,
} from "./types";

function mapDigitalPersonPageResponse(
  response: DigitalPersonBackendPageResponse,
  params?: DigitalPersonQuery,
): DigitalPersonPageResponse {
  return {
    list: response.records ?? [],
    total: response.total ?? 0,
    pageNum: response.current ?? params?.pageNum ?? 1,
    pageSize: response.size ?? params?.pageSize ?? response.records?.length ?? 0,
    pages: response.pages ?? Math.ceil((response.total ?? 0) / Math.max(response.size ?? params?.pageSize ?? 1, 1)),
  };
}

function buildCreateParams(data: DigitalPersonCreateRequest) {
  return {
    name: data.name,
    fileUrl: data.fileUrl,
    trainType: data.trainType,
    language: data.language,
    errorSkip: data.errorSkip,
    callback: data.callback,
  };
}

export async function getDigitalPersonPage(
  params?: DigitalPersonQuery,
  client: DataRequestClient = request,
) {
  const response = await client.get<DigitalPersonBackendPageResponse>("/user-api/aigc/digital-persons", {
    params,
  });

  return mapDigitalPersonPageResponse(response, params);
}

export function getDigitalPersonDetail(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPerson>(`/user-api/aigc/digital-persons/${id}`);
}

export function refreshDigitalPerson(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPerson>(`/user-api/aigc/digital-persons/${id}/refresh`);
}

export function deleteDigitalPerson(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`/user-api/aigc/digital-persons/${id}`);
}

export function createDigitalPerson(
  data: DigitalPersonCreateRequest,
  client: DataRequestClient = request,
) {
  const params = buildCreateParams(data);

  if (data.file) {
    const formData = new FormData();
    formData.append("file", data.file);

    return client.post<DigitalPerson>("/user-api/aigc/digital-persons", formData, {
      ...uploadConfig(),
      params,
    });
  }

  return client.post<DigitalPerson>("/user-api/aigc/digital-persons", undefined, {
    params,
  });
}
