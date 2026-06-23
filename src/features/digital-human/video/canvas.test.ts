import { describe, expect, it } from "vitest";
import {
  clampDigitalHumanVideoFrame,
  resizeDigitalHumanVideoFrameFromPreviewDelta,
  translateDigitalHumanVideoFrameFromPreviewDelta,
} from "./canvas";
import { createDefaultDigitalHumanVideoFormValues } from "./form";

describe("digital human video canvas helpers", () => {
  it("translates preview drag delta into clamped frame coordinates", () => {
    const values = createDefaultDigitalHumanVideoFormValues();

    expect(
      translateDigitalHumanVideoFrameFromPreviewDelta(values, {
        deltaX: 18,
        deltaY: -16,
        previewWidth: 180,
        previewHeight: 320,
      }),
    ).toMatchObject({
      x: 216,
      y: 624,
    });
  });

  it("resizes preview delta into clamped frame size", () => {
    const values = createDefaultDigitalHumanVideoFormValues();

    expect(
      resizeDigitalHumanVideoFrameFromPreviewDelta(values, {
        deltaX: 22.5,
        deltaY: 20,
        previewWidth: 180,
        previewHeight: 320,
      }),
    ).toMatchObject({
      personWidth: 935,
      personHeight: 720,
    });
  });

  it("keeps the frame inside the canvas after drag or resize", () => {
    const values = {
      ...createDefaultDigitalHumanVideoFormValues(),
      x: 900,
      y: 1500,
      personWidth: 240,
      personHeight: 420,
    };

    expect(clampDigitalHumanVideoFrame(values)).toMatchObject({
      x: 900,
      y: 1500,
      personWidth: 180,
      personHeight: 420,
    });

    expect(
      resizeDigitalHumanVideoFrameFromPreviewDelta(values, {
        deltaX: 30,
        deltaY: 40,
        previewWidth: 180,
        previewHeight: 320,
      }),
    ).toMatchObject({
      x: 900,
      y: 1500,
      personWidth: 180,
      personHeight: 420,
    });
  });
});
