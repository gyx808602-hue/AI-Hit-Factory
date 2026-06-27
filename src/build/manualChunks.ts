export function getManualChunkName(id: string): string | undefined {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  if (
    id.includes("/react/") ||
    id.includes("/react-dom/") ||
    id.includes("/scheduler/") ||
    id.includes("/react-router/") ||
    id.includes("/react-router-dom/")
  ) {
    return "react-vendor";
  }

  if (id.includes("antd") || id.includes("@ant-design") || id.includes("@rc-component")) {
    return "antd-vendor";
  }

  if (id.includes("lucide-react")) {
    return "icon-vendor";
  }

  return "vendor";
}
