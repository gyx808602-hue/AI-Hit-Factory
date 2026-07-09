import { useEffect } from "react";
import { useAppSelector } from "../../app/hooks";
import { selectThemeCssVariables } from "./selectors";

export function ThemeCssVariables() {
  const cssVariables = useAppSelector(selectThemeCssVariables);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const rootStyle = document.documentElement.style;

    Object.entries(cssVariables).forEach(([name, value]) => {
      rootStyle.setProperty(name, value);
    });
  }, [cssVariables]);

  return null;
}
