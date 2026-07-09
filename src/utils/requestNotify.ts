export type NotifyMessage = (message: string) => void;

const NOTIFY_DEDUPE_WINDOW = 1500;

export function createDedupedNotify(notify: NotifyMessage): NotifyMessage {
  let lastMessage: { message: string; time: number } | null = null;

  return (message: string) => {
    const now = Date.now();

    if (lastMessage && lastMessage.message === message && now - lastMessage.time < NOTIFY_DEDUPE_WINDOW) {
      return;
    }

    lastMessage = { message, time: now };
    notify(message);
  };
}

export function defaultNotifyError(message: string) {
  // 统一派发请求错误事件，避免请求层直接依赖具体 UI 组件。
  window.dispatchEvent(new CustomEvent("request:error", { detail: { message } }));
  console.error(message);
}

export function defaultNotifySuccess(message: string) {
  // 成功提示同样通过事件交给应用层，保持请求层不直接依赖 Ant Design。
  window.dispatchEvent(new CustomEvent("request:success", { detail: { message } }));
}

export function defaultNotifyPasswordChangeRequired(message: string) {
  window.dispatchEvent(
    new CustomEvent("auth:password-change-required", { detail: { message } }),
  );
}
