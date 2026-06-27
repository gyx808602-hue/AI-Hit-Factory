## 2026-06-27 Git 推送失败排查进展

### 已完成
- 已确认当前问题不是“没提交成功”，而是“本地提交后推送不上去”。
- 已检查当前分支状态：
  - `main...origin/main [ahead 1]`
  - 本地最新提交：`cdee03c v1.0.0版本提交`
- 已确认远端地址配置正常：
  - `origin = https://github.com/gyx808602-hue/AI-Hit-Factory.git`
- 已复现失败命令：
  - `git push --verbose`
  - `git ls-remote origin`
- 已确认失败位置在网络连接阶段，而不是认证阶段：
  - Git Trace 显示直连 `20.205.243.166:443` 超时
  - 报错包含 `Couldn't connect to server` 与 `Connection was reset`
- 已做对照实验：
  - `Invoke-WebRequest https://github.com` 可返回 `200`
  - `curl.exe -I https://github.com` 失败，20 秒左右超时
  - `ssh -T git@github.com` 可建立到 GitHub 的 SSH 通道，但返回 `Permission denied (publickey)`
- 已确认本机存在 SSH 密钥：
  - `C:\Users\Administrator\.ssh\id_ed25519`
  - `C:\Users\Administrator\.ssh\id_ed25519.pub`

### 当前判断
- 当前最可能的根因不是仓库内容问题，也不是提交体积问题。
- 根因更像是这台机器对 GitHub `443` 的命令行链路不稳定或被拦截，导致基于 HTTPS 的 Git / curl 都失败。
- 另一方面，SSH 到 GitHub 是通的，说明可以考虑把 Git 推送链路切换到 SSH。
- 但当前 SSH 公钥尚未在 GitHub 账号中生效，否则 `ssh -T git@github.com` 不会报 `Permission denied (publickey)`。

### 风险与说明
- 工作区当前还有一个未暂存删除项：`用户端.md`。
- 这个删除不会导致当前推送失败，但说明工作区不是完全干净，后续提交前要确认这是不是你故意删掉的。
- 旧的 `doc/progress.md` 已混入非 UTF-8 内容，无法安全用标准补丁方式继续追加，所以本次改为新增独立进展文档记录。

### 下一步建议
1. 优先方案：把 `id_ed25519.pub` 加到 GitHub 的 SSH Keys，然后把远端改为 SSH 地址后再推送。
2. 备选方案：继续深挖本机 HTTPS 到 GitHub 443 的异常，例如代理、企业网络、杀毒/防火墙、Git SSL 栈。
3. 提交前顺手确认 `用户端.md` 是否真的要删除，避免把无意删除一起带上。

## 2026-06-27 SSH 公钥添加指引补充

### 已补充
- 已确认你要添加到 GitHub 的公钥文件正确路径应为：
  - `C:\Users\Administrator\.ssh\id_ed25519.pub`
- 你刚才写的路径 `C:\Users\Administrator.ssh\id_ed25519.pub` 少了 `\.ssh\` 这一层目录。
- 已整理后续操作步骤：
  - 读取公钥内容
  - 登录 GitHub 后台
  - 进入 `Settings -> SSH and GPG keys`
  - 新增 `Authentication Key`
  - 粘贴公钥并保存
  - 再执行 `ssh -T git@github.com` 验证

### 当前判断
- 只要 GitHub 成功录入这把公钥，当前机器大概率就可以绕过 HTTPS 推送异常，改走 SSH 完成 `git push`。

## 2026-06-27 重新生成公钥

### 已开始
- 用户要求“再给一个公钥”。
- 处理方式：生成一把新的 SSH `ed25519` 密钥对，不覆盖已有 `id_ed25519`。
- 计划命名：
  - 私钥：`C:\Users\Administrator\.ssh\id_ed25519_codex_github`
  - 公钥：`C:\Users\Administrator\.ssh\id_ed25519_codex_github.pub`

### 备注
- 新公钥生成后，需要把对应 `.pub` 内容添加到 GitHub `SSH and GPG keys`。
- 如果后面要切换 Git 远端，也可以单独把 `origin` 改为 SSH 地址再验证。

### 新钥匙信息
- 公钥文件：`C:\Users\Administrator\.ssh\id_ed25519_codex_github.pub`
- 私钥文件：`C:\Users\Administrator\.ssh\id_ed25519_codex_github`
- 指纹：`SHA256:Kiyp2l0Q61x/S4ysauGh83dxpRwvtAHYT4dSbodeC5o`
- 公钥内容：
  - `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIMBe6Ze+F2U+P+gpzyWTHJldeQIyU4UDIXyrTuXd5dXX codex-github`
