## Context

音色管理页已经存在于 `src/pages/CustomisedAudiosPage.tsx`，当前创建弹窗包含音色名称、音频地址、模型类型、语种和试听文案。现阶段产品要求创建参数只保留名称和参考音频地址，且参考音频需要采用爆文改编页那类上传展示方式，不再让用户手填 URL。

项目内已经存在通用上传 API 封装：`uploadAudio(file)`，返回 `url/objectKey/originalFilename`。爆文改编页已经采用 `Upload.Dragger + beforeUpload` 的页面内上传模式，上传完成后把返回 URL 写入页面状态。本变更应复用这个模式，不新增依赖，不新建公共上传组件。

知识点拨：这里的“上传音频”和“创建音色”是两个后端动作。上传接口负责把本地文件变成服务端可访问的 URL；创建接口只消费这个 URL 和名称。类比前端表单，就是先把文件选择器的临时 File 转换成稳定表单值，再提交业务表单，这样业务接口不用承担文件流处理和表单校验两类职责。

## Goals / Non-Goals

**Goals:**

- 创建弹窗只暴露音色名称和音频上传入口。
- 参考音频使用 Ant Design Upload/Dragger 风格展示，上传成功后展示文件名和成功状态。
- 创建提交使用上传返回的音频 URL，不再依赖用户手填地址。
- 创建 payload 只主动携带 `name` 和当前前端契约中的 `url`。
- 保持页面内实现，复用已有 API 和交互模式，避免过度抽象。

**Non-Goals:**

- 不重做音色列表、筛选、分页、刷新、删除能力。
- 不接入音色编辑保存接口；当前编辑弹窗仍只做回填和关闭。
- 不新增全局 Upload 组件或 shared 抽象。
- 不修改路由、菜单权限码或动态路由映射。
- 不新增模型、语种、试听文案的隐藏默认配置提交。

## Decisions

1. **上传交互保留在 `CustomisedAudiosPage.tsx` 内**

   - 选择：在音色页面内引入 `Upload` 与 `uploadAudio`，给创建弹窗传入上传状态和处理函数。
   - Why：当前只有这一处音色参考音频上传场景，抽公共组件会增加 props、状态同步和测试成本。等同一上传字段在 2 个以上稳定业务场景复用时，再上提到 feature 或 shared。
   - 备选：抽 `AudioUploadField` 公共组件。暂不采用，原因是复用面不足。

2. **使用 `Upload.Dragger + beforeUpload`，上传后返回 `false`**

   - 选择：复用爆文页模式，通过 `beforeUpload` 手动调用 `uploadAudio(file)`，成功后写入 `formValues.url` 和展示文件名。
   - Why：Ant Design Upload 默认会自己发请求；项目已有上传 API 负责统一 request 前缀、FormData 和鉴权，手动上传能保持请求封装层级一致。
   - 备选：使用 Upload 的 `action` 属性直连接口。暂不采用，原因是会绕开现有 request 封装与错误处理。

3. **创建 payload 只主动提交 `name` 和 `url`**

   - 选择：`mapFormValuesToCreatePayload` 不再携带 `modelType/language/text`。
   - Why：隐藏字段如果继续提交默认值，会让用户不可见的配置影响后端行为；表单展示与提交契约要一致。
   - 备注：用户口径中的 `referenceAudioUrl` 与当前前端契约中的 `url` 需要在实现阶段确认。如果后端仍接收 `url`，保持不变；如果后端已改为 `referenceAudioUrl`，再同步类型、API 测试与提交映射。

4. **模型、语种、试听文案只隐藏，不删除类型兼容字段**

   - 选择：表单 UI 不渲染这些字段，创建提交不主动发送；类型可先保留兼容列表回填、编辑弹窗或后续接口扩展。
   - Why：删除类型会扩大影响面，尤其列表数据和编辑回填仍可能带有这些字段。本次只解决创建体验，不做不必要的结构清理。

5. **React Query 边界不变**

   - 选择：创建音色仍走 `useCreateCustomisedAudioMutation`；上传音频作为弹窗内一次性动作，不进入全局状态。
   - Why：上传文件名、上传中、上传结果 URL 都是短生命周期表单状态，放到全局状态会增加缓存失效和清理负担。

6. **动态路由与权限边界不变**

   - 选择：不调整 route registry、dynamic routes 或权限码。
   - Why：本变更只影响已存在页面内的创建弹窗。路由守卫仍负责页面访问体验，后端仍需复核创建接口权限。

## Risks / Trade-offs

- [Risk] 后端真实字段已从 `url` 改为 `referenceAudioUrl` → 实现前复核接口契约；若已变更，同步类型和测试，避免只改 UI 不改 payload。
- [Risk] 上传失败后用户不知道如何处理 → 弹窗内保留错误 message，并不写入 `url`，提交校验继续拦截。
- [Risk] 隐藏字段后后端仍要求 `modelType/language/text` → 以真实接口为准；若后端必填，应由后端给出默认值，或产品重新确认是否需要重新展示。
- [Trade-off] 不抽公共上传组件会有少量页面内 JSX → 换来更小改动和更低维护成本；当音频上传字段出现真实复用时再抽象。

## Migration Plan

1. 更新音色页面创建弹窗 UI 和表单状态。
2. 更新创建 payload 映射。
3. 更新页面测试，覆盖上传成功、必填校验和隐藏字段。
4. 执行定向页面测试和 TypeScript 检查。
5. 若需要回滚，仅恢复 `CustomisedAudiosPage.tsx` 与对应测试即可，不涉及数据迁移。

## Open Questions

- 后端创建音色接口当前字段名是否仍为 `url`，还是已经改成 `referenceAudioUrl`？
- 上传文件类型是否需要前端限制为 `audio/*`，以及是否有大小限制文案？若后端暂无明确限制，前端先只使用 `accept="audio/*"` 做轻量约束。
