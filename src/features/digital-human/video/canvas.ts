import type { DigitalHumanVideoFormValues } from "./form";

interface PreviewDelta {
  deltaX: number;
  deltaY: number;
  previewWidth: number;
  previewHeight: number;
}

function toCanvasDelta(delta: PreviewDelta, values: DigitalHumanVideoFormValues) {
  const scaleX = values.screenWidth / Math.max(delta.previewWidth, 1);
  const scaleY = values.screenHeight / Math.max(delta.previewHeight, 1);

  return {
    canvasDeltaX: Math.round(delta.deltaX * scaleX),
    canvasDeltaY: Math.round(delta.deltaY * scaleY),
  };
}

export function clampDigitalHumanVideoFrame(values: DigitalHumanVideoFormValues) {
  const maxWidth = Math.max(values.screenWidth - values.x, 1);
  const maxHeight = Math.max(values.screenHeight - values.y, 1);
  const nextWidth = Math.min(Math.max(values.personWidth, 1), maxWidth);
  const nextHeight = Math.min(Math.max(values.personHeight, 1), maxHeight);
  const nextX = Math.min(Math.max(values.x, 0), Math.max(values.screenWidth - nextWidth, 0));
  const nextY = Math.min(Math.max(values.y, 0), Math.max(values.screenHeight - nextHeight, 0));

  return {
    ...values,
    x: nextX,
    y: nextY,
    personWidth: nextWidth,
    personHeight: nextHeight,
  };
}

export function translateDigitalHumanVideoFrameFromPreviewDelta(
  values: DigitalHumanVideoFormValues,
  delta: PreviewDelta,
) {
  const { canvasDeltaX, canvasDeltaY } = toCanvasDelta(delta, values);

  return clampDigitalHumanVideoFrame({
    ...values,
    x: values.x + canvasDeltaX,
    y: values.y + canvasDeltaY,
  });
}

export function resizeDigitalHumanVideoFrameFromPreviewDelta(
  values: DigitalHumanVideoFormValues,
  delta: PreviewDelta,
) {
  const { canvasDeltaX, canvasDeltaY } = toCanvasDelta(delta, values);

  return clampDigitalHumanVideoFrame({
    ...values,
    personWidth: values.personWidth + canvasDeltaX,
    personHeight: values.personHeight + canvasDeltaY,
  });
}
