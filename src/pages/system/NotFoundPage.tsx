import { Button, Result } from "antd";

export function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Result
        status="404"
        title="页面不存在"
        subTitle="请检查路由地址，或从左侧导航重新进入。"
        extra={<Button type="primary">返回工作台</Button>}
      />
    </div>
  );
}
