import { describe, expect, it } from "vitest";
import { filterAssets, filterDigitalHumans, filterTasks } from "./mockData";

describe("workspace mock data filters", () => {
  it("filters tasks by type and status label", () => {
    const tasks = filterTasks({
      keyword: "",
      type: "商品视频",
      statusLabel: "生成成功",
    });

    expect(tasks.length).toBeGreaterThan(0);
    expect(tasks.every((task) => task.type === "商品视频")).toBe(true);
    expect(tasks.every((task) => task.status === "success")).toBe(true);
  });

  it("filters assets by type and keyword", () => {
    const assets = filterAssets({
      keyword: "保温杯",
      type: "image",
    });

    expect(assets.length).toBeGreaterThan(0);
    expect(assets.every((asset) => asset.type === "image")).toBe(true);
    expect(assets.every((asset) => asset.name.includes("保温杯") || asset.tag?.includes("保温杯"))).toBe(true);
  });

  it("filters digital humans by status and search text", () => {
    const humans = filterDigitalHumans({
      search: "小雅",
      status: "启用",
    });

    expect(humans).toHaveLength(1);
    expect(humans[0].name).toBe("小雅");
  });
});
