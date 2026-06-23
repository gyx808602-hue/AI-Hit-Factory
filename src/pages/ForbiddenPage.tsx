import { Button, Result } from "antd";

export function ForbiddenPage() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <Result
        status="403"
        title="暂无访问权限"
        subTitle="当前账号暂时没有访问该页面的权限，后续接入账号体系后将由权限码控制。"
        extra={<Button type="primary">返回工作台</Button>}
      />
    </div>
  );
}
