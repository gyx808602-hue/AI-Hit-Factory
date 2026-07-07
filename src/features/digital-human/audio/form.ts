import type {
  CustomisedAudio,
  CustomisedAudioCreateRequest,
} from "../../../api/aigc/customised-audios/types";

export type AudioModalMode = "create" | "edit";

export type AudioFormValues = {
  name: string;
  url: string;
  modelType: string;
  language: string;
  text: string;
};

export type AudioFormErrors = Partial<Record<keyof AudioFormValues, string>>;

// 音色表单模型靠近 audio feature，页面只负责提交时调用映射结果。
export function createDefaultAudioFormValues(): AudioFormValues {
  return {
    name: "",
    url: "",
    modelType: "tts",
    language: "cn",
    text: "",
  };
}

export function validateAudioFormValues(values: AudioFormValues): AudioFormErrors {
  const errors: AudioFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "璇疯緭鍏ラ煶鑹插悕绉?";
  }

  if (!values.url.trim()) {
    errors.url = "璇疯緭鍏ラ煶棰戝湴鍧€";
  }

  return errors;
}

export function mapAudioFormValuesToCreatePayload(
  values: AudioFormValues,
): CustomisedAudioCreateRequest {
  return {
    name: values.name.trim(),
    url: values.url.trim(),
    modelType: values.modelType,
    language: values.language,
    text: values.text.trim() || undefined,
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
