import type {
  DigitalPersonCreateRequest,
  DigitalPersonLanguage,
  DigitalPersonTrainType,
} from "../../api/aigc/digital-persons/types";

export type DigitalHumanMaterialMode = "upload" | "url";

export interface DigitalHumanFormValues {
  name: string;
  materialMode: DigitalHumanMaterialMode;
  file: File | null;
  fileUrl: string;
  trainType: DigitalPersonTrainType;
  language: DigitalPersonLanguage;
  errorSkip: boolean;
}

export interface DigitalHumanFormErrors {
  name?: string;
  file?: string;
  fileUrl?: string;
}

export function createDefaultDigitalHumanFormValues(): DigitalHumanFormValues {
  return {
    name: "",
    materialMode: "upload",
    file: null,
    fileUrl: "",
    trainType: "both",
    language: "cn",
    errorSkip: false,
  };
}

export function validateDigitalHumanFormValues(
  values: DigitalHumanFormValues,
): DigitalHumanFormErrors {
  const errors: DigitalHumanFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "请输入数字人名称";
  }

  if (values.materialMode === "upload") {
    if (!values.file) {
      errors.file = "请上传训练素材";
    }
  } else if (!values.fileUrl.trim()) {
    errors.fileUrl = "请输入素材 URL";
  }

  return errors;
}

export function mapDigitalHumanFormValuesToCreatePayload(
  values: DigitalHumanFormValues,
): DigitalPersonCreateRequest {
  const payload: DigitalPersonCreateRequest = {
    name: values.name.trim(),
    trainType: values.trainType,
    language: values.language,
    errorSkip: values.errorSkip,
  };

  if (values.materialMode === "upload") {
    if (values.file) {
      payload.file = values.file;
    }
    return payload;
  }

  payload.fileUrl = values.fileUrl.trim();
  return payload;
}
