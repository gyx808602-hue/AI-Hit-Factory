import { Alert, Button, Checkbox, Form, Input } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import {
  BadgeCheck,
  LockKeyhole,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { changePassword, getCaptcha, login } from "../api/system/auth";
import type {
  AuthenticationToken,
  CaptchaInfo,
  ChangePasswordRequest,
  LoginRequest,
} from "../api/system/auth/types";
import { AuthStorage } from "../utils/auth";

const REMEMBER_ME_KEY = "ai_hit_factory_remember_me";
const REMEMBERED_USERNAME_KEY = "ai_hit_factory_remembered_username";
const INITIAL_PASSWORD_CHANGE_CODE = "C10001";

type LoginFormValues = {
  username: string;
  password: string;
  captchaKey: string;
  captchaCode: string;
  rememberMe: boolean;
};

type ChangePasswordFormValues = ChangePasswordRequest;

type PasswordResetContext = {
  username: string;
  tokens: AuthenticationToken;
  message: string;
};

type InitialPasswordChangeErrorLike = {
  code: string;
  data: AuthenticationToken;
  message?: string;
  msg?: string;
};

function getRememberMe() {
  return window.localStorage.getItem(REMEMBER_ME_KEY) === "true";
}

function getRememberedUsername() {
  return window.localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? "";
}

function setRememberState(rememberMe: boolean, username: string) {
  window.localStorage.setItem(REMEMBER_ME_KEY, String(rememberMe));

  if (rememberMe) {
    window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
    return;
  }

  window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
}

function getCaptchaKey(captcha: CaptchaInfo) {
  return captcha.captchaKey || captcha.captchaId || "";
}

function buildFallbackCaptcha(): CaptchaInfo {
  return {
    captchaKey: "local-fallback",
    captchaBase64:
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="44" viewBox="0 0 128 44">
          <rect width="128" height="44" rx="8" fill="#1A1B28"/>
          <text x="64" y="28" text-anchor="middle" font-family="Arial" font-size="18" font-weight="700" fill="#9B7FFF">AIFC</text>
        </svg>`,
      ),
  };
}

function isInitialPasswordChangeError(
  error: unknown,
): error is InitialPasswordChangeErrorLike {
  const maybeError = error as {
    code?: string;
    data?: Partial<AuthenticationToken>;
  };

  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "data" in error &&
    maybeError.code === INITIAL_PASSWORD_CHANGE_CODE &&
    typeof maybeError.data?.accessToken === "string" &&
    typeof maybeError.data?.refreshToken === "string"
  );
}

function getInitialPasswordChangeMessage(error: InitialPasswordChangeErrorLike) {
  return error.message || error.msg || "请先修改初始密码";
}

export function LoginPage() {
  const [loginForm] = Form.useForm<LoginFormValues>();
  const [changePasswordForm] = Form.useForm<ChangePasswordFormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const [captcha, setCaptcha] = useState<CaptchaInfo>(() => buildFallbackCaptcha());
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [changePasswordSubmitting, setChangePasswordSubmitting] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [passwordResetContext, setPasswordResetContext] = useState<PasswordResetContext | null>(null);

  const redirectPath = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("redirect") || "/";
  }, [location.search]);

  const loginInitialValues = useMemo<LoginFormValues>(
    () => ({
      username: getRememberedUsername(),
      password: "",
      captchaKey: getCaptchaKey(captcha),
      captchaCode: "",
      rememberMe: getRememberMe(),
    }),
    [captcha],
  );

  async function refreshCaptcha() {
    if (!import.meta.env.VITE_APP_BASE_API) {
      const fallback = buildFallbackCaptcha();
      setCaptcha(fallback);
      loginForm.setFieldValue("captchaKey", getCaptchaKey(fallback));
      return;
    }

    setCaptchaLoading(true);
    try {
      const nextCaptcha = await getCaptcha();
      setCaptcha(nextCaptcha);
      loginForm.setFieldValue("captchaKey", getCaptchaKey(nextCaptcha));
    } catch {
      const fallback = buildFallbackCaptcha();
      setCaptcha(fallback);
      loginForm.setFieldValue("captchaKey", getCaptchaKey(fallback));
    } finally {
      setCaptchaLoading(false);
    }
  }

  async function handleLogin(values: LoginFormValues) {
    setSubmitting(true);
    try {
      const tokens = await login({
        phone: values.username,
        password: values.password,
        captchaKey: getCaptchaKey(captcha),
        captchaCode: values.captchaCode,
      } satisfies LoginRequest);

      AuthStorage.setTokenPair(tokens);
      AuthStorage.setCurrentUserName(values.username);
      setRememberState(values.rememberMe, values.username);
      navigate(redirectPath, { replace: true });
    } catch (error) {
      if (isInitialPasswordChangeError(error)) {
        AuthStorage.setTokenPair(error.data);
        setPasswordResetContext({
          username: values.username,
          tokens: error.data,
          message: getInitialPasswordChangeMessage(error),
        });
        changePasswordForm.setFieldsValue({
          oldPassword: values.password,
          newPassword: "",
          confirmPassword: "",
        });
        return;
      }

      await refreshCaptcha();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleChangePassword(values: ChangePasswordFormValues) {
    setChangePasswordSubmitting(true);
    try {
      await changePassword(values);
      AuthStorage.clear();
      setPasswordResetContext(null);
      changePasswordForm.resetFields();
      loginForm.setFieldValue("password", "");
      loginForm.setFieldValue("captchaCode", "");
      await refreshCaptcha();
    } finally {
      setChangePasswordSubmitting(false);
    }
  }

  function handleRememberChange(event: CheckboxChangeEvent) {
    loginForm.setFieldValue("rememberMe", event.target.checked);
  }

  function checkCapsLock(event: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState("CapsLock"));
  }

  useEffect(() => {
    void refreshCaptcha();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen overflow-auto bg-[radial-gradient(circle_at_18%_20%,rgba(124,92,252,0.22),transparent_32%),radial-gradient(circle_at_82%_18%,rgba(249,115,22,0.16),transparent_30%),var(--app-bg)] text-[var(--text-primary)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1.18fr)_minmax(420px,0.82fr)]">
        <section className="flex min-h-[340px] flex-col justify-between px-6 py-7 sm:px-10 lg:min-h-screen lg:px-16 lg:py-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#7C5CFC,#F97316)] shadow-[0_16px_36px_rgba(124,92,252,0.28)]">
              <Sparkles size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="m-0 text-[20px] font-semibold leading-6">AI 爆款工厂</h1>
              <p className="m-0 text-[12px] text-[var(--text-muted)]">电商 AI 内容生产平台</p>
            </div>
          </div>

          <div className="max-w-[680px] py-8 sm:py-14 lg:py-0">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-semibold text-[#9B7FFF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7C5CFC] shadow-[0_0_0_4px_rgba(124,92,252,0.18)]" />
              Enterprise AI Workspace
            </div>
            <h2 className="m-0 max-w-[620px] text-[30px] font-bold leading-[1.12] tracking-normal text-white sm:text-[48px] lg:text-[56px]">
              登录后开始生产可转化的电商内容
            </h2>
            <p className="mt-5 max-w-[560px] text-[15px] leading-7 text-[var(--text-secondary)]">
              统一管理商品视频、图文生视频、爆款改编、数字人和素材资产，让内容生产流程从灵感到交付保持清晰可控。
            </p>

            <div className="mt-8 hidden max-w-[620px] grid-cols-1 gap-3 sm:grid sm:grid-cols-3">
              {[
                { icon: ShieldCheck, label: "权限隔离", desc: "企业空间与角色控制" },
                { icon: BadgeCheck, label: "合规留痕", desc: "协议、任务、操作可追溯" },
                { icon: Sparkles, label: "AI 生产", desc: "多类型内容演示闭环" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="rounded-lg border border-white/10 bg-white/[0.035] p-4"
                  >
                    <Icon size={18} className="text-[#9B7FFF]" />
                    <div className="mt-3 text-[13px] font-semibold text-white">{item.label}</div>
                    <div className="mt-1 text-[12px] leading-5 text-[var(--text-muted)]">
                      {item.desc}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="m-0 text-[12px] text-[var(--text-muted)]">Copyright © 2026 AI-Hit-Factory</p>
        </section>

        <section className="flex min-h-[560px] items-center justify-center border-t  border-white/10 bg-[#10111A]/95 px-5 py-10 lg:min-h-screen lg:border-l lg:border-t-0 lg:px-10">
          <div className="w-full max-w-[420px]">
            <div className="mb-7">
              <h2 className="m-0 text-[32px] font-bold leading-10 text-white">
                {passwordResetContext ? "首次登录重置密码" : "欢迎回来"}
              </h2>
              <p className="mt-2 text-[13px] text-[var(--text-muted)]">
                {passwordResetContext
                  ? `账户 ${passwordResetContext.username} 需要先完成初始密码重置`
                  : "输入账号信息，继续进入你的 AI 电商内容工作台"}
              </p>
            </div>

            {passwordResetContext ? (
              <>
                <Alert
                  type="warning"
                  showIcon
                  message={passwordResetContext.message}
                  className="mb-5"
                />

                <Form
                  form={changePasswordForm}
                  layout="vertical"
                  requiredMark={false}
                  onFinish={handleChangePassword}
                >
                  <Form.Item
                    name="oldPassword"
                    rules={[{ required: true, message: "请输入旧密码" }]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockKeyhole size={16} />}
                      placeholder="请输入旧密码"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item
                    name="newPassword"
                    rules={[
                      { required: true, message: "请输入新密码" },
                      { min: 6, message: "新密码不能少于 6 位" },
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockKeyhole size={16} />}
                      placeholder="请输入新密码"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                      { required: true, message: "请再次输入新密码" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("newPassword") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error("两次输入的新密码不一致"));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockKeyhole size={16} />}
                      placeholder="请再次输入新密码"
                      autoComplete="new-password"
                    />
                  </Form.Item>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={changePasswordSubmitting}
                    className="w-full"
                  >
                    确认重置密码
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Form
                  form={loginForm}
                  layout="vertical"
                  initialValues={loginInitialValues}
                  requiredMark={false}
                  onFinish={handleLogin}
                >
                  <Form.Item
                    name="username"
                    rules={[{ required: true, message: "请输入用户名或手机号" }]}
                  >
                    <Input
                      size="large"
                      prefix={<UserRound size={16} />}
                      placeholder="请输入用户名 / 手机号"
                      autoComplete="username"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: "请输入密码" },
                      { min: 6, message: "密码不能少于 6 位" },
                    ]}
                    help={capsLock ? "大写锁定已开启" : undefined}
                  >
                    <Input.Password
                      size="large"
                      prefix={<LockKeyhole size={16} />}
                      placeholder="请输入密码"
                      autoComplete="current-password"
                      onKeyUp={checkCapsLock}
                    />
                  </Form.Item>

                  <Form.Item name="captchaKey" hidden>
                    <Input />
                  </Form.Item>

                  <Form.Item
                    name="captchaCode"
                    rules={[{ required: true, message: "请输入验证码" }]}
                  >
                    <div className="flex gap-3">
                      <Input
                        size="large"
                        placeholder="请输入验证码"
                        className="min-w-0 flex-1"
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        className="flex h-10 w-[116px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--line-subtle)] bg-[var(--muted-bg)] transition hover:border-[#7C5CFC]"
                        onClick={() => void refreshCaptcha()}
                        aria-label="刷新验证码"
                      >
                        {captchaLoading ? (
                          <RefreshCw
                            size={16}
                            className="animate-spin text-[var(--text-muted)]"
                          />
                        ) : (
                          <img
                            src={captcha.captchaBase64}
                            alt="验证码"
                            className="h-full w-full object-contain"
                          />
                        )}
                      </button>
                    </div>
                  </Form.Item>

                  <div className="mb-6 flex items-center justify-between text-[13px]">
                    <Form.Item name="rememberMe" valuePropName="checked" noStyle>
                      <Checkbox onChange={handleRememberChange}>记住我</Checkbox>
                    </Form.Item>
                    <button
                      type="button"
                      className="border-0 bg-transparent p-0 text-[#9B7FFF] transition hover:text-[#B8A6FF]"
                    >
                      忘记密码？
                    </button>
                  </div>

                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    className="w-full"
                  >
                    登录
                  </Button>
                </Form>

                <div className="mt-7">
                  <div className="mb-4 flex items-center gap-3 text-[12px] text-[var(--text-muted)]">
                    <span className="h-px flex-1 bg-[var(--line-subtle)]" />
                    其他登录方式
                    <span className="h-px flex-1 bg-[var(--line-subtle)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--line-subtle)] bg-white/[0.02] text-[13px] text-[var(--text-secondary)] transition hover:border-[#7C5CFC] hover:text-[#9B7FFF]"
                    >
                      <QrCode size={16} />
                      扫码登录
                    </button>
                    <button
                      type="button"
                      className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--line-subtle)] bg-white/[0.02] text-[13px] text-[var(--text-secondary)] transition hover:border-[#7C5CFC] hover:text-[#9B7FFF]"
                    >
                      <ShieldCheck size={16} />
                      统一认证
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
