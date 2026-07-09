import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";
import { createAppStore } from "../../app/store";
import { setThemePalette, setThemeSurfaces } from "./slice";
import { ThemeCssVariables } from "./ThemeCssVariables";

describe("ThemeCssVariables", () => {
  it("syncs Redux theme values to document root CSS variables", () => {
    const store = createAppStore();

    store.dispatch(setThemePalette({ primary: "#0052CC", info: "#00B8D9" }));
    store.dispatch(setThemeSurfaces({ appBg: "#05070A", sidebarBg: "#080B12" }));

    render(
      <Provider store={store}>
        <ThemeCssVariables />
      </Provider>,
    );

    const rootStyle = document.documentElement.style;

    expect(rootStyle.getPropertyValue("--brand-primary")).toBe("#0052CC");
    expect(rootStyle.getPropertyValue("--brand-info")).toBe("#00B8D9");
    expect(rootStyle.getPropertyValue("--app-bg")).toBe("#05070A");
    expect(rootStyle.getPropertyValue("--sidebar-bg")).toBe("#080B12");
  });
});
