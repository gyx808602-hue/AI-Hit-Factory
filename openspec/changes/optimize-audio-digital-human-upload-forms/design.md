## Context

项目当前是 Vite + React + TypeScript，UI 以 Ant Design + TailwindCSS 为主，服务端状态使用 TanStack Query。上传 API 已在 `src/api/aigc/uploads/index.ts` 中按文件类型封装为 `uploadAudio`、`uploadImage`、`uploadVideo`，并统一走 request 层和 FormData 封装。

追爆页 `src/pages/content/ViralRemixPage.tsx` 已形成可复用的交互模式：Ant Design Upload/Dragger 作为入口，`beforeUpload` 内手动调用项目上传 API，上传成功后把返回的 `url/originalFilename` 写入页面状态，后续业务创建只消费 URL。

当前差异：

- 文件音色创建表单仍保留模型类型、语种、试听文案等非当前必要字段，并且音频地址容易回到手动输入形态。
- 数字人创建弹窗当前保存本地 `File` 并用 object URL 做本地预览，尚未完成“上传到服务端后的结果 URL 回显和删除”闭环。

知识点拨：这里要区分“素材上传接口”和“业务创建接口”。上传接口负责把浏览器里的临时 File 转成服务端可访问 URL；业务创建接口只接收稳定 URL 和业务字段。类比前端表单，就是先把非稳定的输入控件状态转换成稳定表单值，再提交表单，避免业务接口同时承担文件流处理和业务创建两种职责。

## Goals / Non-Goals

**Goals:**

- 文件音色新建只展示并校验名称和音频上传结果。
- 文件音色音频地址由 `uploadAudio(file)` 返回的 URL 写入，不以手动粘贴作为主要流程。
- 数字人本地训练素材使用 `uploadImage(file)` 或 `uploadVideo(file)` 上传，上传后回填 URL。
- 数字人本地训练素材按图片/视频展示上传结果，并支持手动删除。
- 通过 OpenSpec 和进展文档固定本次本地修改边界，避免后续误回退。

**Non-Goals:**

- 不重做音色列表、数字人列表、筛选、分页、刷新、删除、详情跳转。
- 不新增全局上传组件，除非实现时确认同一上传组合已经在两个以上稳定业务场景中完全重复且抽象收益明确。
- 不修改后端接口路径。
- 不新增模型、语种、训练类型等业务配置能力。
- 不处理磁盘删除或批量清理。

## Decisions

1. **上传流程复用追爆页模式**

   - 选择：使用 Ant Design `Upload` 或 `Upload.Dragger`，通过 `beforeUpload` 手动调用 `uploadAudio/uploadImage/uploadVideo`，返回 `Upload.LIST_IGNORE` 或 `false` 阻止 Ant Design 默认上传。
   - Why：项目已有统一 request 层和上传 API，直接使用 Upload 的 `action` 会绕开鉴权、错误处理和 baseURL 逻辑。

2. **文件音色创建 payload 收敛到名称和 URL**

   - 选择：`AudioFormValues` 创建态只保留 `name`、`url`，可增加 `uploadedAudioName` 这类 UI 状态，但提交 payload 不主动带 `modelType/language/text`。
   - Why：表单可见字段和提交契约要一致。隐藏字段继续提交默认值，会让用户不可见的配置影响后端行为。

3. **数字人本地训练素材从 File 直传创建改为先上传再提交 URL**

   - 选择：上传成功后把 `fileUrl`、`uploadedMaterialName`、`uploadedMaterialType` 写入表单，创建数字人时通过 `fileUrl` 提交；本地 `File` 只作为短生命周期上传输入，不进入最终业务创建 payload。
   - Why：后端创建接口通过 URL 处理训练素材更稳定，也便于回显、删除和重试。若后端仍要求 multipart 创建，需在实现前确认接口契约，但 UI 层仍应展示上传结果。

4. **数字人素材类型由文件 MIME 决定**

   - 选择：`file.type.startsWith("image/")` 走 `uploadImage`，`file.type.startsWith("video/")` 走 `uploadVideo`，其他类型阻止并提示。
   - Why：接口按图片/视频拆分，前端选择正确上传 API 能减少后端类型识别成本。

5. **删除只清空前端表单状态，不删除远端对象**

   - 选择：用户点击删除回显时，仅清空当前表单里的 URL、文件名、类型和错误提示，不调用远端文件删除接口。
   - Why：项目当前没有统一远端素材删除 API，且用户明确要求禁止擅自删除磁盘内容。远端对象清理应由后端生命周期或后续专门接口处理。

6. **不提前抽 shared 上传组件**

   - 选择：优先在 `features/digital-human` 和 `features/digital-human/audio` 内部实现，必要时沉淀轻量 helper，而不是新增通用 `BaseUpload`。
   - Why：KISS。当前两处上传虽然模式类似，但字段文案、预览类型、提交契约不同，过早抽象会制造复杂 props。

7. **React Query 边界不变**

   - 选择：上传作为弹窗内一次性动作，不进全局状态；创建仍通过现有 mutation hooks；成功后按现有逻辑刷新/关闭/跳转。
   - Why：上传中的文件名、进度、URL 是短生命周期表单状态，放入全局状态会增加清理成本。

8. **动态路由与权限不变**

   - 选择：不调整 route registry、菜单权限和路由守卫。
   - Why：本次只改变已有页面的弹窗表单交互，权限仍由页面入口和后端接口复核承担。

## UI / UX

- 上传入口优先使用 Ant Design Upload/Dragger 或 Button 包裹 Upload，保留 loading/disabled，避免重复提交。
- 表单字段必须有可见 label，不使用 placeholder 代替 label。
- 上传成功后展示：
  - 文件音色：文件名、已上传状态、音频播放器、删除入口。
  - 数字人素材：文件名、已上传状态、图片预览或视频播放器、删除入口。
- 删除后展示空态和重新上传入口。
- 上传失败使用 Ant Design message 或表单内错误文案反馈，不写入 URL。

## Risks / Trade-offs

- [Risk] 数字人后端创建接口仍只支持 multipart `file`。实现前需复核当前接口契约；若后端暂未支持 URL 创建，应保留兼容路径或与后端确认改造。
- [Risk] 音色创建字段名可能从 `url` 变为 `referenceAudioUrl`。实现时以当前 API 类型和测试为准，必要时同步类型与 API 测试。
- [Trade-off] 不抽公共上传组件会有少量重复 JSX。换来更小改动面和更低抽象成本。
- [Risk] 后续误回退为手动输入或本地 File 直传。通过 OpenSpec、任务清单、专题进展文档和测试断言固定行为。

## Migration Plan

1. 先补测试，锁定文件音色只保留名称和音频上传、数字人素材上传回显和删除。
2. 改文件音色表单值、UI、上传处理和 payload 映射。
3. 改数字人表单值、UI、上传处理、删除处理和创建 payload 映射。
4. 运行定向测试、typecheck 和 OpenSpec strict 校验。
5. 更新 `doc/progress.md` 和专题进展文档，记录已实现边界和不可回退点。

## Open Questions

- 文件音色后端创建音频字段当前是否仍为 `url`？若已改名，需要同步 API 类型。
- 数字人创建接口是否已经支持 `fileUrl` 作为上传后素材 URL？若不支持，需要后端配合或保留临时兼容。
