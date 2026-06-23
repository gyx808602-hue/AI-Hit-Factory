import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const {
  mockedGetCaptcha,
  mockedLogin,
  mockedChangePassword,
  mockedSetTokenPair,
  mockedClear,
  mockedNavigate,
} = vi.hoisted(() => ({
  mockedGetCaptcha: vi.fn(),
  mockedLogin: vi.fn(),
  mockedChangePassword: vi.fn(),
  mockedSetTokenPair: vi.fn(),
  mockedClear: vi.fn(),
  mockedNavigate: vi.fn(),
}));

vi.mock("../api/system/auth", () => ({
  getCaptcha: mockedGetCaptcha,
  login: mockedLogin,
  changePassword: mockedChangePassword,
}));

vi.mock("../utils/auth", () => ({
  AuthStorage: {
    setTokenPair: mockedSetTokenPair,
    clear: mockedClear,
  },
  redirectToLogin: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={["/login"]}>
      <LoginPage />
    </MemoryRouter>,
  );
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetCaptcha.mockResolvedValue({
      captchaId: "captcha-id",
      captchaBase64:
        "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='44'%3E%3C/svg%3E",
    });
  });

  it("renders the login experience", async () => {
    renderLoginPage();

    expect(screen.getByRole("heading", { name: "AI 爆款工厂" })).toBeInTheDocument();
    expect(screen.getByText("电商 AI 内容生产平台")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入用户名 / 手机号")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入验证码")).toBeInTheDocument();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });
  });

  it("switches to the change-password form when login returns C10001", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      msg: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });

    renderLoginPage();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "15838237810" } });
    fireEvent.change(screen.getByPlaceholderText("请输入验证码"), {
      target: { value: "1234" },
    });

    const passwordInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(passwordInputs[0] as HTMLInputElement, {
      target: { value: "Init@123" },
    });

    fireEvent.submit(document.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        phone: "15838237810",
        password: "Init@123",
        captchaKey: "captcha-id",
        captchaCode: "1234",
      });
    });

    await waitFor(() => {
      expect(screen.getByText("请先修改初始密码")).toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText("请输入旧密码")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入新密码")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请再次输入新密码")).toBeInTheDocument();
    expect(mockedSetTokenPair).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 7200,
    });
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("returns to the login form after changing the initial password", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      msg: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });
    mockedChangePassword.mockResolvedValue(undefined);

    renderLoginPage();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });

    const loginTextboxes = screen.getAllByRole("textbox");
    fireEvent.change(loginTextboxes[0], { target: { value: "15838237810" } });
    fireEvent.change(screen.getByPlaceholderText("请输入验证码"), {
      target: { value: "1234" },
    });

    const loginPasswordInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(loginPasswordInputs[0] as HTMLInputElement, {
      target: { value: "Init@123" },
    });

    fireEvent.submit(document.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        phone: "15838237810",
        password: "Init@123",
        captchaKey: "captcha-id",
        captchaCode: "1234",
      });
    });

    await waitFor(() => {
      expect(screen.getByPlaceholderText("请输入旧密码")).toBeInTheDocument();
    });

    const changePasswordInputs = document.querySelectorAll('input[type="password"]');
    fireEvent.change(changePasswordInputs[0] as HTMLInputElement, {
      target: { value: "Init@123" },
    });
    fireEvent.change(changePasswordInputs[1] as HTMLInputElement, {
      target: { value: "NewPass@123" },
    });
    fireEvent.change(changePasswordInputs[2] as HTMLInputElement, {
      target: { value: "NewPass@123" },
    });

    fireEvent.submit(document.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(mockedChangePassword).toHaveBeenCalledWith({
        oldPassword: "Init@123",
        newPassword: "NewPass@123",
        confirmPassword: "NewPass@123",
      });
    });

    expect(mockedClear).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /登录/ })).toBeInTheDocument();
    });
  });
});
