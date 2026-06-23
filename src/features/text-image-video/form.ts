import type { UploadRespVO } from "../../api/aigc/uploads/types";
import type {
  TextImageVideoCreateRequest,
  TextImageVideoTask,
} from "../../api/customer/text-image-video/types";

export type TextImageVideoFormValues = {
  prompt: string;
  model: string;
  imageUrls: string[];
};

export function createDefaultTextImageVideoFormValues(): TextImageVideoFormValues {
  return {
    prompt: "",
    model: "seedance2.0",
    imageUrls: [],
  };
}

export function mapUploadResponsesToImageUrls(uploads: UploadRespVO[]) {
  return uploads.map((item) => item.url);
}

export function mapTaskDetailToFormValues(task: TextImageVideoTask): TextImageVideoFormValues {
  return {
    prompt: task.prompt,
    model: task.model || "seedance2.0",
    imageUrls: Array.isArray(task.imageUrls) ? task.imageUrls : [],
  };
}

export function mapTextImageVideoFormValuesToCreatePayload(
  values: TextImageVideoFormValues,
): TextImageVideoCreateRequest {
  return {
    prompt: values.prompt.trim(),
    model: values.model || "seedance2.0",
    imageUrls: Array.isArray(values.imageUrls) ? values.imageUrls : [],
  };
}
