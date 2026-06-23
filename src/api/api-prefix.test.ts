/// <reference types="node" />

import { readdirSync, readFileSync, statSync } from "fs";
import path from "path";
import { describe, expect, it } from "vitest";

function collectApiSourceFiles(directory: string): string[] {
  return readdirSync(directory).flatMap((entry: string) => {
    const absolutePath = path.join(directory, entry);
    const stats = statSync(absolutePath);

    if (stats.isDirectory()) {
      return collectApiSourceFiles(absolutePath);
    }

    if (!absolutePath.endsWith(".ts") || absolutePath.endsWith(".test.ts") || absolutePath.endsWith(".d.ts")) {
      return [];
    }

    return [absolutePath];
  });
}

describe("api path prefix", () => {
  it("uses /user-api instead of legacy /api/v1 prefix in production api modules", () => {
    const apiDirectory = path.resolve(process.cwd(), "src/api");
    const sourceFiles = collectApiSourceFiles(apiDirectory);

    const legacyFiles = sourceFiles.filter((filePath) => readFileSync(filePath, "utf8").includes('"/api/v1'));

    expect(legacyFiles).toEqual([]);
  });
});
