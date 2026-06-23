import type { UploadRespVO } from "../../api/aigc/uploads/types";
import type {
  DigitalPersonVideoCreateRequest,
  DigitalPersonVideoLanguage,
  DigitalPersonVideoType,
} from "../../api/aigc/digital-person-videos/types";

export interface DigitalHumanVideoFormValues {
  name: string;
  personId: string;
  type: DigitalPersonVideoType;
  text: string;
  customAudioId: string;
  wavUrl: string;
  backgroundImageUrl: string;
  bgColor: string;
  screenWidth: number;
  screenHeight: number;
  x: number;
  y: number;
  personWidth: number;
  personHeight: number;
  rgbaMode: boolean;
  speed: number;
  pitch: number;
  volume: number;
  language: DigitalPersonVideoLanguage;
  model: number;
  addComplianceWatermark: boolean;
  resolutionRate: number;
}

export interface DigitalHumanVideoFormErrors {
  name?: string;
  personId?: string;
  text?: string;
  wavUrl?: string;
  speed?: string;
  pitch?: string;
  volume?: string;
  screenWidth?: string;
  screenHeight?: string;
  x?: string;
  y?: string;
  personWidth?: string;
  personHeight?: string;
  personFrame?: string;
}

export function createDefaultDigitalHumanVideoFormValues(): DigitalHumanVideoFormValues {
  return {
    name: "",
    personId: "",
    type: "tts",
    text: "",
    customAudioId: "",
    wavUrl: "",
    backgroundImageUrl: "",
    bgColor: "#EDEDED",
    screenWidth: 1080,
    screenHeight: 1920,
    x: 108,
    y: 720,
    personWidth: 800,
    personHeight: 600,
    rgbaMode: false,
    speed: 1,
    pitch: 1,
    volume: 100,
    language: "cn",
    model: 1,
    addComplianceWatermark: false,
    resolutionRate: 0,
  };
}

export function validateDigitalHumanVideoFormValues(
  values: DigitalHumanVideoFormValues,
): DigitalHumanVideoFormErrors {
  const errors: DigitalHumanVideoFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "请输入视频名称";
  }

  if (!values.personId.trim()) {
    errors.personId = "请选择数字人形象";
  }

  if (values.type === "tts") {
    if (!values.text.trim()) {
      errors.text = "请输入驱动文本";
    }
  } else if (!values.wavUrl.trim()) {
    errors.wavUrl = "请上传或填写驱动音频";
  }

  if (values.speed < 0.5 || values.speed > 2) {
    errors.speed = "语速需在 0.5 到 2 之间";
  }

  if (values.pitch < 0.5 || values.pitch > 2) {
    errors.pitch = "音调需在 0.5 到 2 之间";
  }

  if (values.volume < 0 || values.volume > 100) {
    errors.volume = "音量需在 0 到 100 之间";
  }

  if (values.screenWidth <= 0) {
    errors.screenWidth = "画布宽需大于 0";
  }

  if (values.screenHeight <= 0) {
    errors.screenHeight = "画布高需大于 0";
  }

  if (values.x < 0) {
    errors.x = "人物 X 不能小于 0";
  }

  if (values.y < 0) {
    errors.y = "人物 Y 不能小于 0";
  }

  if (values.personWidth <= 0) {
    errors.personWidth = "人物宽需大于 0";
  }

  if (values.personHeight <= 0) {
    errors.personHeight = "人物高需大于 0";
  }

  if (
    values.screenWidth > 0 &&
    values.screenHeight > 0 &&
    values.personWidth > 0 &&
    values.personHeight > 0 &&
    values.x >= 0 &&
    values.y >= 0 &&
    (values.x + values.personWidth > values.screenWidth ||
      values.y + values.personHeight > values.screenHeight)
  ) {
    errors.personFrame = "人物区域不能超出画布范围";
  }

  return errors;
}

export function mapDigitalHumanVideoFormValuesToCreatePayload(
  values: DigitalHumanVideoFormValues,
): DigitalPersonVideoCreateRequest {
  const payload: DigitalPersonVideoCreateRequest = {
    name: values.name.trim(),
    personId: values.personId.trim(),
    type: values.type,
    bgColor: values.bgColor,
    screenWidth: values.screenWidth,
    screenHeight: values.screenHeight,
    x: values.x,
    y: values.y,
    personWidth: values.personWidth,
    personHeight: values.personHeight,
    rgbaMode: values.rgbaMode,
    speed: values.speed,
    pitch: values.pitch,
    volume: values.volume,
    language: values.language,
    model: values.model,
    addComplianceWatermark: values.addComplianceWatermark,
    resolutionRate: values.resolutionRate,
  };

  if (values.backgroundImageUrl.trim()) {
    payload.bg = {
      src_url: values.backgroundImageUrl.trim(),
      x: 0,
      y: 0,
      width: values.screenWidth,
      height: values.screenHeight,
    };
  }

  if (values.type === "tts") {
    payload.text = values.text.trim();
    if (values.customAudioId.trim()) {
      payload.customAudioId = values.customAudioId.trim();
    }
    return payload;
  }

  payload.wavUrl = values.wavUrl.trim();
  return payload;
}

export function mapUploadResponseToBackgroundConfig(upload: UploadRespVO) {
  return upload.url;
}

export function mapUploadResponseToWavUrl(upload: UploadRespVO) {
  return upload.url;
}
