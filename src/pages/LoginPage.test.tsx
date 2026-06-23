import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

vi.mock("../api/system/auth", () => ({
  getCaptcha: vi.fn(async () => ({
    captchaId: "captcha-id",
    captchaBase64:
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='44'%3E%3C/svg%3E",
  })),
  login: vi.fn(),
}));

describe("LoginPage", () => {
  it("renders the project-adapted login experience", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: "AI 爆款工厂" })).toBeInTheDocument();
    expect(screen.getByText("电商 AI 内容生产平台")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "欢迎回来" })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入用户名 / 手机号")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入密码")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入验证码")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "记住我" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^登\s*录$/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "扫码登录" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "统一认证" })).toBeInTheDocument();
  });
});
