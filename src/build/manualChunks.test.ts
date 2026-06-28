import { describe, expect, it } from "vitest";
import { getManualChunkName } from "./manualChunks";

describe("getManualChunkName", () => {
  it("keeps scheduler inside react-vendor to avoid runtime chunk cycles", () => {
    expect(
      getManualChunkName("F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/scheduler/index.js"),
    ).toBe("react-vendor");
  });

  it("keeps react-router-dom inside react-vendor", () => {
    expect(
      getManualChunkName(
        "F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/react-router-dom/dist/index.js",
      ),
    ).toBe("react-vendor");
  });

  it("keeps antd packages inside antd-vendor", () => {
    expect(
      getManualChunkName("F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/antd/es/index.js"),
    ).toBe("antd-vendor");
  });

  it("keeps ant design icons inside antd-vendor to avoid chunk cycles", () => {
    expect(
      getManualChunkName(
        "F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/@ant-design/icons/es/icons/UploadOutlined.js",
      ),
    ).toBe("antd-vendor");
  });

  it("keeps ant design shared utilities inside antd-vendor", () => {
    expect(
      getManualChunkName(
        "F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/@ant-design/cssinjs/es/index.js",
      ),
    ).toBe("antd-vendor");
  });

  it("keeps rc ecosystem packages inside antd-vendor", () => {
    expect(
      getManualChunkName("F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/rc-upload/es/index.js"),
    ).toBe("antd-vendor");
  });

  it("returns vendor for remaining third-party dependencies", () => {
    expect(
      getManualChunkName("F:/AAA_AI_aisperce/AI-Hit-Factory/node_modules/qs/lib/index.js"),
    ).toBe("vendor");
  });

  it("does not split application source files into vendor chunks", () => {
    expect(getManualChunkName("F:/AAA_AI_aisperce/AI-Hit-Factory/src/app/App.tsx")).toBe(
      undefined,
    );
  });
});
