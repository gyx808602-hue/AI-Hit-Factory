import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LazyImage } from "./LazyImage";

describe("LazyImage", () => {
  it("renders image thumbnails with browser-level lazy loading", () => {
    render(<LazyImage src="/asset-thumb.svg" alt="保温杯主图" />);

    const image = screen.getByRole("img", { name: "保温杯主图" });

    expect(image).toHaveAttribute("loading", "lazy");
    expect(image).toHaveAttribute("decoding", "async");
  });
});
