import type {
  CustomisedAudio,
  CustomisedAudioCreateRequest,
} from "../../../api/aigc/customised-audios/types";

export type AudioModalMode = "create" | "edit";

export type AudioFormValues = {
  name: string;
  url: string;
  modelType?: string;
  language?: string;
  text?: string;
};

export type AudioFormErrors = Partial<Record<keyof AudioFormValues, string>>;

// 音色创建只暴露名称和上传后的音频 URL，编辑态继续保留历史字段回填能力。
export function createDefaultAudioFormValues(): AudioFormValues {
  return {
    name: "",
    url: "",
  };
}

export function validateAudioFormValues(values: AudioFormValues): AudioFormErrors {
  const errors: AudioFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "请输入音色名称";
  }

  if (!values.url.trim()) {
    errors.url = "请上传音频";
  }

  return errors;
}

export function mapAudioFormValuesToCreatePayload(
  values: AudioFormValues,
): CustomisedAudioCreateRequest {
  // 创建接口只接收用户可见字段，避免隐藏默认值悄悄影响后端训练行为。
  return {
    name: values.name.trim(),
    url: values.url.trim(),
  };
}

export function createAudioFormValuesFromAudio(
  audio: CustomisedAudio,
): AudioFormValues {
  return {
    name: audio.name ?? "",
    url: audio.url ?? audio.audioPath ?? audio.sourceUrl ?? "",
    modelType: audio.modelType ?? "tts",
    language: audio.language ?? "cn",
    text: audio.text ?? audio.previewText ?? "",
  };
}
