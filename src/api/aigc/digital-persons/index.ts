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

const DIGITAL_PERSONS_BASE_URL = "/digital-persons";
function mapDigitalPersonPageResponse(
  response: DigitalPersonBackendPageResponse,
  params?: DigitalPersonQuery,
): DigitalPersonPageResponse {
  const records = response.records ?? [];

  return {
    list: records,
    records,
    total: response.total ?? 0,
    pageNum: response.current ?? params?.pageNum ?? 1,
    pageSize: response.size ?? params?.pageSize ?? records.length,
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
  const response = await client.get<DigitalPersonBackendPageResponse>(DIGITAL_PERSONS_BASE_URL, {
    params,
  });

  return mapDigitalPersonPageResponse(response, params);
}

export function getDigitalPersonDetail(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPerson>(`${DIGITAL_PERSONS_BASE_URL}/${id}`);
}

export function refreshDigitalPerson(id: Id, client: DataRequestClient = request) {
  return client.get<DigitalPerson>(`${DIGITAL_PERSONS_BASE_URL}/${id}/refresh`);
}

export function deleteDigitalPerson(id: Id, client: DataRequestClient = request) {
  return client.delete<void>(`${DIGITAL_PERSONS_BASE_URL}/${id}`);
}

export function createDigitalPerson(
  data: DigitalPersonCreateRequest,
  client: DataRequestClient = request,
) {
  const params = buildCreateParams(data);

  if (data.file) {
    const formData = new FormData();
    formData.append("file", data.file);

    return client.post<DigitalPerson>(`${DIGITAL_PERSONS_BASE_URL}`, formData, {
      ...uploadConfig(),
      params,
    });
  }

  return client.post<DigitalPerson>(`${DIGITAL_PERSONS_BASE_URL}`, params);
}
