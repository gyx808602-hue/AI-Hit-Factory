import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LoginPage } from "./LoginPage";

const {
  mockedGetCaptcha,
  mockedLogin,
  mockedChangePassword,
  mockedSetCurrentUserName,
  mockedSetTokenPair,
  mockedClear,
  mockedNavigate,
  mockedMessageSuccess,
} = vi.hoisted(() => ({
  mockedGetCaptcha: vi.fn(),
  mockedLogin: vi.fn(),
  mockedChangePassword: vi.fn(),
  mockedSetCurrentUserName: vi.fn(),
  mockedSetTokenPair: vi.fn(),
  mockedClear: vi.fn(),
  mockedNavigate: vi.fn(),
  mockedMessageSuccess: vi.fn(),
}));

vi.mock("../../api/system/auth", () => ({
  getCaptcha: mockedGetCaptcha,
  login: mockedLogin,
  changePassword: mockedChangePassword,
}));

vi.mock("../../utils/auth", () => ({
  AuthStorage: {
    setCurrentUserName: mockedSetCurrentUserName,
    setTokenPair: mockedSetTokenPair,
    clear: mockedClear,
  },
  redirectToLogin: vi.fn(),
}));

vi.mock("antd", async () => {
  const actual = await vi.importActual<typeof import("antd")>("antd");

  return {
    ...actual,
    message: {
      ...actual.message,
      success: mockedMessageSuccess,
    },
  };
});

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

function getCaptchaImage() {
  return document.querySelector('img[alt="验证码"]') as HTMLImageElement | null;
}

async function submitLogin(username = "15838237810", password = "Init@123") {
  await waitFor(() => {
    expect(mockedGetCaptcha).toHaveBeenCalled();
  });

  const textboxes = screen.getAllByRole("textbox");
  fireEvent.change(textboxes[0], { target: { value: username } });
  fireEvent.change(screen.getByPlaceholderText("请输入验证码"), {
    target: { value: "1234" },
  });

  const passwordInputs = document.querySelectorAll('input[type="password"]');
  fireEvent.change(passwordInputs[0] as HTMLInputElement, {
    target: { value: password },
  });

  fireEvent.submit(document.querySelector("form") as HTMLFormElement);
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

  it("stores current user name after login succeeds", async () => {
    mockedLogin.mockResolvedValueOnce({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 7200,
    });

    renderLoginPage();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });

    const textboxes = screen.getAllByRole("textbox");
    fireEvent.change(textboxes[0], { target: { value: "merchant01" } });
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
        phone: "merchant01",
        password: "Init@123",
        captchaId: "captcha-id",
        captchaCode: "1234",
      });
    });

    expect(mockedSetCurrentUserName).toHaveBeenCalledWith("merchant01");
    expect(mockedSetTokenPair).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 7200,
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

  it("renders captcha image from captchaBase64 data url", async () => {
    renderLoginPage();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getCaptchaImage()).not.toBeNull();
      expect(getCaptchaImage()?.getAttribute("src")).toBe(
        "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='44'%3E%3C/svg%3E",
      );
    });
  });

  it("adds png data url prefix for raw base64 captcha", async () => {
    mockedGetCaptcha.mockResolvedValueOnce({
      id: "captcha-id",
      base64PNG: "iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAIAAAC6iKly",
    });

    renderLoginPage();

    await waitFor(() => {
      expect(mockedGetCaptcha).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(getCaptchaImage()).not.toBeNull();
      expect(getCaptchaImage()?.getAttribute("src")).toBe(
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAoCAIAAAC6iKly",
      );
    });
  });

  it("opens a forced password change dialog when login returns C10001", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      message: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });

    renderLoginPage();

    await submitLogin();

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        phone: "15838237810",
        password: "Init@123",
        captchaId: "captcha-id",
        captchaCode: "1234",
      });
    });

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveTextContent("首次登录重置密码");
    expect(dialog).toHaveTextContent("请先修改初始密码");
    expect(within(dialog).getByPlaceholderText("请输入旧密码")).toBeInTheDocument();
    expect(within(dialog).getByPlaceholderText("请输入新密码")).toBeInTheDocument();
    expect(within(dialog).getByPlaceholderText("请再次输入新密码")).toBeInTheDocument();
    expect(mockedSetTokenPair).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 7200,
    });
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("stores temporary tokens when C10001 response includes token data", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      message: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });

    renderLoginPage();

    await submitLogin();

    await screen.findByRole("dialog");

    expect(mockedSetTokenPair).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      tokenType: "Bearer",
      expiresIn: 7200,
    });
    expect(mockedNavigate).not.toHaveBeenCalled();
  });

  it("blocks forced password change submit when confirm password does not match", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      message: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });

    renderLoginPage();

    await submitLogin();

    const dialog = await screen.findByRole("dialog");
    fireEvent.change(within(dialog).getByPlaceholderText("请输入旧密码"), {
      target: { value: "Init@123" },
    });
    fireEvent.change(within(dialog).getByPlaceholderText("请输入新密码"), {
      target: { value: "NewPass@123" },
    });
    fireEvent.change(within(dialog).getByPlaceholderText("请再次输入新密码"), {
      target: { value: "Different@123" },
    });

    fireEvent.submit(dialog.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(screen.getByText("两次输入的新密码不一致")).toBeInTheDocument();
    });
    expect(mockedChangePassword).not.toHaveBeenCalled();
  });

  it("returns to the login form after changing the initial password", async () => {
    mockedLogin.mockRejectedValueOnce({
      code: "C10001",
      message: "请先修改初始密码",
      data: {
        accessToken: "access-token",
        refreshToken: "refresh-token",
        tokenType: "Bearer",
        expiresIn: 7200,
      },
    });
    mockedChangePassword.mockResolvedValue(undefined);

    renderLoginPage();

    await submitLogin();

    await waitFor(() => {
      expect(mockedLogin).toHaveBeenCalledWith({
        phone: "15838237810",
        password: "Init@123",
        captchaId: "captcha-id",
        captchaCode: "1234",
      });
    });

    const dialog = await screen.findByRole("dialog");

    fireEvent.change(within(dialog).getByPlaceholderText("请输入旧密码"), {
      target: { value: "Init@123" },
    });
    fireEvent.change(within(dialog).getByPlaceholderText("请输入新密码"), {
      target: { value: "NewPass@123" },
    });
    fireEvent.change(within(dialog).getByPlaceholderText("请再次输入新密码"), {
      target: { value: "NewPass@123" },
    });

    fireEvent.submit(dialog.querySelector("form") as HTMLFormElement);

    await waitFor(() => {
      expect(mockedChangePassword).toHaveBeenCalledWith({
        oldPassword: "Init@123",
        newPassword: "NewPass@123",
        confirmPassword: "NewPass@123",
      });
    });

    expect(mockedClear).toHaveBeenCalled();
    expect(mockedMessageSuccess).toHaveBeenCalledWith("密码修改成功，请重新登录");

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /登录/ })).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
