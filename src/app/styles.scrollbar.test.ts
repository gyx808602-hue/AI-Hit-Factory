import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesSource = readFileSync("src/app/styles.css", "utf8");

describe("global scrollbar styles", () => {
  it("defines shared scrollbar tokens for the dark workspace theme", () => {
    expect(stylesSource).toContain("--scrollbar-size:");
    expect(stylesSource).toContain("--scrollbar-thumb:");
    expect(stylesSource).toContain("--scrollbar-thumb-hover:");
    expect(stylesSource).toContain("--scrollbar-track:");
  });

  it("styles Firefox and WebKit scrollbars globally", () => {
    expect(stylesSource).toContain("scrollbar-width: thin;");
    expect(stylesSource).toContain("scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);");
    expect(stylesSource).toContain("::-webkit-scrollbar");
    expect(stylesSource).toContain("::-webkit-scrollbar-thumb");
    expect(stylesSource).toContain("::-webkit-scrollbar-track");
    expect(stylesSource).toContain("::-webkit-scrollbar-thumb:hover");
  });
});
